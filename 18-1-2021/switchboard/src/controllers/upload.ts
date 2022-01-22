import Koa from 'koa';
import Sequelize from 'sequelize';
import fs from 'fs';
import fsPro from 'fs-extra';
import path from 'path';
import dirTree from 'directory-tree';
import { cleanDir, moveData, validateExistPath } from '../utils/filesystem';
import { createError } from '../utils/createError';
import { spawn } from 'child_process';

// *file processing controller

export const processFiles = async (ctx: Koa.Context) => {
  fs.writeFile('/root/patent-art/node-service/log.txt', '', () => {});
  const { itemList, project_id, parentItemId, transactionId, case_id } = ctx.request.body;
  const processTransaction = await ctx.rawDb.transaction();
  // get project data
  const projectData = await ctx.db.tblProjects.findOne({
    where: {
      id: project_id ? project_id : 1
    }
  });

  console.log('projectdata', projectData.dataValues.target_base_directory);
  if (!projectData) {
    createError(400, 'Project data is not found!');
  }

  // check if target directory is created
  if (!fs.existsSync(projectData.dataValues.target_base_directory)) {
    fs.mkdirSync(projectData.dataValues.target_base_directory, { recursive: true });
  }
  try {
    if (!itemList || itemList.length === 0) {
      createError(400, 'source itemList is required!');
    }

    if (!(project_id && parentItemId !== undefined)) {
      createError(400, 'project ID & parent is required!');
    }

    const sourceMap = itemList.map(async (object: any) => {
      if (!object || !object.itemName) {
        createError(400, 'source Items not valid!');
      }
      let replaceObj: { title: string; version: any } = { title: '', version: 1 };
      const projectPath = projectData ? projectData.dataValues.target_base_directory : '/';
      console.log('projectpath:????????', projectPath);

      const tempDirectoryPath = path.resolve('./');
      let parentPath = projectPath;
      const timeStamp = Date.now();
      if (parentItemId !== 0) {
        const projects = await ctx.db.tblLibraryItems.findOne({
          where: {
            library_item_id: parentItemId
          }
        });
        if (!projects) {
          createError(400, 'Parent is not valid or its already deleted!');
        }
        parentPath = projects.dataValues.file_path;
      }

      let fullPath = path.join(tempDirectoryPath, replaceSpace(object.itemName));

      if (fs.statSync(fullPath).isDirectory()) {
        fsPro.moveSync(fullPath, `${fullPath}_${timeStamp}`);
        fullPath = `${fullPath}_${timeStamp}`;
        const filteredTree = dirTree(replaceSpace(fullPath), {
          // @ts-ignore
          attributes: ['size', 'type', 'extension']
        });
        const getData = async (data: any = {}, i = 0, isFirstDoc = false) => {
          const nParentPath = `${parentPath}/${data.path
            .replace('./', '')
            .replace(`${tempDirectoryPath}/`, '')
            .replace(`temp_upload/${projectData.project_name}/user_1/`, '')}`;

          fs.appendFile(
            '/root/patent-art/node-service/log.txt',
            'data' + JSON.stringify(data) + '\n' + nParentPath,
            () => {}
          );

          if (data.type === 'directory') {
            const parts = nParentPath.split('/');
            fs.appendFile(
              '/root/patent-art/node-service/log.txt',
              'uploading folder \n' + object.isReplace + '\n' + nParentPath,
              () => {}
            );
            // if isReplace is true
            //if (object.isReplace && fs.existsSync(nParentPath)) {
            if (object.isReplace) {
              // find items by path.
              // const findData = await ctx.db.tblLibraryItems.findOne({
              //   where: {
              //     file_path: nParentPath
              //   }
              // });

              fs.appendFile('/root/patent-art/node-service/log.txt', 'uploading with replace folder \n', () => {});

              //const partts = object.itemName.split('/');
              // find items by path.
              const Data = await ctx.rawDb.query(
                `select *
                 from tblLibraryItems tli,
                      tblLibraryItemTree tlit
                 where tlit.parent_id = ${parentItemId}
                   and tli.library_item_id = tlit.library_item_id
                   and cast(tli.title as varchar) = '${parts[parts.length - 1]}'
                   and status = 1`,
                { type: ctx.rawDb.QueryTypes.SELECT }
              );

              fs.appendFile('/root/patent-art/node-service/log.txt', 'Data' + JSON.stringify(Data) + '\n', () => {});

              const findData: any = Data ? { dataValues: Data[0] } : undefined;

              fs.appendFile(
                '/root/patent-art/node-service/log.txt',
                'findData' + JSON.stringify(findData) + '\n',
                () => {}
              );

              // update version & size - history insert log
              if (findData.dataValues) {
                fs.appendFile(
                  '/root/patent-art/node-service/log.txt',
                  'search result \n' + findData.dataValues.title,
                  () => {}
                );

                if (isFirstDoc) {
                  replaceObj = { version: findData.dataValues.item_version, title: findData.dataValues.title };
                }

                const updateData = await ctx.db.tblLibraryItems.update(
                  { item_version: findData.dataValues.item_version + 1, size: data.size, file_path: nParentPath },
                  {
                    where: {
                      library_item_id: findData.dataValues.library_item_id
                    },
                    transaction: processTransaction
                  }
                );

                // library history table log insert
                await ctx.db.tblLibraryItemsHistory.create(
                  {
                    object_id: findData.dataValues.library_item_id,
                    object_type: 'library_item',
                    title: findData.dataValues.title,
                    tenant_id: findData.dataValues.tenant_id,
                    case_id: findData.dataValues.case_id,
                    item_version: findData.dataValues.item_version + 1,
                    is_secured: findData.dataValues.item_version,
                    created: Sequelize.fn('GETDATE'),
                    created_by: findData.dataValues.created_by,
                    comments: 'file version updated',
                    file_path: findData.dataValues.file_path
                  },
                  {
                    transaction: processTransaction
                  }
                );
              }

              const childItems = data.children.map(async (x: any) => {
                return getData(x, findData.dataValues.library_item_id);
              });
              await Promise.all(childItems);
            } else {
              // library table insert
              const directory = await ctx.db.tblLibraryItems.create(
                {
                  case_id: case_id ? case_id : 1,
                  title: parts[parts.length - 1].replace(`_${timeStamp}`, ''),
                  is_secured: 0,
                  tenant_id: 1,
                  item_version: 1,
                  file_path: nParentPath,
                  created: Sequelize.fn('GETDATE'),
                  modified: Sequelize.fn('GETDATE'),
                  created_by: `${ctx.user.email}`,
                  modified_by: `${ctx.user.email}`,
                  status: 1,
                  type: 'folder',
                  size: data.size,
                  in_use: 1,
                  tag: 'test',
                  keywords: 'test',
                  check_in_status: null,
                  check_out_by: null,
                  name: parts[parts.length - 1],
                  owned_by: 'user'
                },
                {
                  transaction: processTransaction
                }
              );

              // library tree table insert

              await ctx.db.tblLibraryItemTree.create(
                {
                  library_item_id: directory.library_item_id,
                  id: directory.library_item_id,
                  parent_id: i,
                  tenant_id: 1,
                  item_version: 1
                },
                {
                  transaction: processTransaction
                }
              );

              // library history table log insert
              await ctx.db.tblLibraryItemsHistory.create(
                {
                  object_id: directory.library_item_id,
                  object_type: 'library_item',
                  title: directory.title,
                  tenant_id: directory.tenant_id,
                  case_id: directory.case_id,
                  item_version: directory.item_version,
                  is_secured: directory.item_version,
                  created: Sequelize.fn('GETDATE'),
                  created_by: directory.created_by,
                  comments: 'file upload',
                  file_path: directory.file_path
                },
                {
                  transaction: processTransaction
                }
              );

              const childItems = data.children.map(async (x: any) => {
                return getData(x, directory.library_item_id);
              });
              await Promise.all(childItems);
            }
          } else if (data.type === 'file') {
            // if isReplace is true
            if (object.isReplace && fs.existsSync(nParentPath)) {
              // find items by path.
              //     const findData = await ctx.db.tblLibraryItems.findOne({
              //      where: {
              //        file_path: nParentPath
              //      }
              //   });

              //const parts = object.itemName.split('/');
              // find items by path.
              const Data = await ctx.rawDb.query(
                `select *
                 from tblLibraryItems tli,
                      tblLibraryItemTree tlit
                 where tlit.parent_id = ${parentItemId}
                   and tli.library_item_id = tlit.library_item_id
                   and cast(tli.title as varchar) = data.title
                   and status = 1`,
                { type: ctx.rawDb.QueryTypes.SELECT }
              );

              const findData: any = Data ? { dataValues: Data[0] } : undefined;

              // update version & size - history insert log
              if (findData.dataValues) {
                const updateData = await ctx.db.tblLibraryItems.update(
                  { item_version: findData.dataValues.item_version + 1, size: data.size, file_path: nParentPath },
                  {
                    where: {
                      library_item_id: findData.dataValues.library_item_id
                    },
                    transaction: processTransaction
                  }
                );

                // library history table log insert
                await ctx.db.tblLibraryItemsHistory.create(
                  {
                    object_id: findData.dataValues.library_item_id,
                    object_type: 'library_item',
                    title: findData.dataValues.title,
                    tenant_id: findData.dataValues.tenant_id,
                    case_id: findData.dataValues.case_id,
                    item_version: findData.dataValues.item_version + 1,
                    is_secured: findData.dataValues.item_version,
                    created: Sequelize.fn('GETDATE'),
                    created_by: findData.dataValues.created_by,
                    comments: 'file version updated',
                    file_path: findData.dataValues.file_path
                  },
                  { transaction: processTransaction }
                );
              }
              return;
            }
            // if no replace
            else {
              // library table insert
              const itemPlacement = await ctx.db.tblLibraryItems.create(
                {
                  case_id: case_id ? case_id : 1,
                  title: data.name,
                  is_secured: 0,
                  tenant_id: 1,
                  item_version: 1,
                  file_path: nParentPath,
                  created: Sequelize.fn('GETDATE'),
                  modified: Sequelize.fn('GETDATE'),
                  created_by: `${ctx.user.email}`,
                  modified_by: `${ctx.user.email}`,
                  status: 1,
                  type: data.extension.replace('.', ''),
                  size: data.size,
                  in_use: 1,
                  tag: 'test',
                  keywords: 'test',
                  check_in_status: null,
                  check_out_by: null,
                  name: data.name,
                  owned_by: 'user'
                },
                {
                  transaction: processTransaction
                }
              );

              // library tree table insert

              await ctx.db.tblLibraryItemTree.create(
                {
                  library_item_id: itemPlacement.library_item_id,
                  id: itemPlacement.library_item_id,
                  parent_id: i,
                  tenant_id: 1,
                  item_version: 1
                },
                { transaction: processTransaction }
              );

              // library history table log insert
              await ctx.db.tblLibraryItemsHistory.create(
                {
                  object_id: itemPlacement.library_item_id,
                  object_type: 'library_item',
                  title: itemPlacement.title,
                  tenant_id: itemPlacement.tenant_id,
                  case_id: itemPlacement.case_id,
                  item_version: itemPlacement.item_version,
                  is_secured: itemPlacement.item_version,
                  created: Sequelize.fn('GETDATE'),
                  created_by: itemPlacement.created_by,
                  comments: 'file upload',
                  file_path: itemPlacement.file_path
                },
                { transaction: processTransaction }
              );
            }
            return;
          }
        };
        await getData(filteredTree, parentItemId, true);
      } else {
        const fileExtension = await path.extname(fullPath);
        let tempPath = `${path.dirname(fullPath)}/${timeStamp}_${path.basename(fullPath)}`;

        fs.appendFile('/root/patent-art/node-service/log.txt', 'tempPath :' + tempPath + '\n', () => {});

        fs.appendFile('/root/patent-art/node-service/log.txt', 'fullPath :' + fullPath + '\n', () => {});

        moveData(fullPath, tempPath);
        fullPath = tempPath;
        validateExistPath('path not exist', tempPath);
        const { size } = fs.statSync(tempPath);
        let fileSizeInBytes = size;
        let fileName = await path.basename(tempPath);

        fs.appendFile('/root/patent-art/node-service/log.txt', 'fileName :' + fileName + '\n', () => {});

        // if replace is false
        if (!object.isReplace) {
          // library table insert
          const directory = await ctx.db.tblLibraryItems.create(
            {
              case_id: case_id ? case_id : 1,
              title: fileName.replace(`${timeStamp}_`, ''),
              is_secured: 0,
              tenant_id: 1,
              item_version: 1,
              file_path:
                parentItemId === 0
                  ? `${projectData.target_base_directory}/${fileName}`
                  : parentPath.concat(`/${fileName}`),
              created: Sequelize.fn('GETDATE'),
              modified: Sequelize.fn('GETDATE'),
              created_by: `${ctx.user.email}`,
              modified_by: `${ctx.user.email}`,
              status: 1,
              type: fileExtension.replace('.', ''),
              size: fileSizeInBytes / 1024,
              in_use: 0,
              tag: 'test',
              keywords: 'test',
              check_in_status: null,
              check_out_by: null,
              name: fileName,
              owned_by: 'user'
            },
            { transaction: processTransaction }
          );

          // library tree table insert
          await ctx.db.tblLibraryItemTree.create(
            {
              library_item_id: directory.library_item_id,
              id: directory.library_item_id,
              parent_id: parentItemId,
              tenant_id: directory.tenant_id,
              item_version: directory.item_version
            },
            { transaction: processTransaction }
          );

          // library history table log insert
          await ctx.db.tblLibraryItemsHistory.create(
            {
              object_id: directory.library_item_id,
              object_type: 'library_item',
              title: directory.title,
              tenant_id: directory.tenant_id,
              case_id: directory.case_id,
              item_version: directory.item_version,
              is_secured: directory.item_version,
              created: Sequelize.fn('GETDATE'),
              created_by: directory.created_by,
              comments: 'file upload',
              file_path: directory.file_path
            },
            { transaction: processTransaction }
          );
        } else {
          //if isReplace file is true
          const parts = object.itemName.split('/');
          // find items by path.
          const Data = await ctx.rawDb.query(
            `select *
             from tblLibraryItems tli,
                  tblLibraryItemTree tlit
             where tlit.parent_id = ${parentItemId}
               and tli.library_item_id = tlit.library_item_id
               and cast(tli.title as varchar) = '${parts[parts.length - 1]}'
               and status = 1`,
            { type: ctx.rawDb.QueryTypes.SELECT }
          );

          const findData: any = Data ? { dataValues: Data[0] } : undefined;

          if (!findData) {
            createError(500, 'path not found!');
          }

          // rename old document with version
          fs.rename(
            `${findData.dataValues.file_path}`,
            `${findData.dataValues.file_path}.${findData.dataValues.item_version}`,
            (error) => {
              if (error) {
                createError(400, 'File rename is failed!');
              }
            }
          );

          // update version & size - history insert log
          if (findData.dataValues) {
            const data = await ctx.db.tblLibraryItems.update(
              {
                item_version: findData.dataValues.item_version + 1,
                file_path:
                  parentItemId === 0
                    ? `${projectData.target_base_directory}/${fileName}`
                    : parentPath.concat(`/${fileName}`),
                size: fileSizeInBytes
              },
              {
                where: {
                  library_item_id: findData.dataValues.library_item_id
                },
                transaction: processTransaction
              }
            );

            // library history table log insert
            await ctx.db.tblLibraryItemsHistory.create(
              {
                object_id: findData.dataValues.library_item_id,
                object_type: 'library_item',
                title: findData.dataValues.title,
                tenant_id: findData.dataValues.tenant_id,
                case_id: findData.dataValues.case_id,
                item_version: findData.dataValues.item_version + 1,
                is_secured: findData.dataValues.item_version,
                created: Sequelize.fn('GETDATE'),
                created_by: findData.dataValues.created_by,
                comments: 'file version updated',
                file_path: findData.dataValues.file_path
              },
              { transaction: processTransaction }
            );
          }
        }
      }
      const logsDir = `temp_upload/${projectData.project_name}/${projectData.project_name}.logs`;
      // call for document process log
      createDocumentLog(transactionId, logsDir, 'done');
      if (object.isReplace) {
        //fsPro.moveSync(`${parentPath}/${replaceObj.title}`, `${parentPath}/${replaceObj.title}.${replaceObj.version}`);
        //fsPro.moveSync(fullPath, './' + parentPath, {
        // overwrite: true
        //});
        spawn('mv', [fullPath, parentPath]);
      } else {
        fs.appendFile('/root/patent-art/node-service/log.txt', 'moving temp to project storage' + '\n', () => {});
        fs.appendFile('/root/patent-art/node-service/log.txt', 'fullPath :' + fullPath + '\n', () => {});
        fs.appendFile('/root/patent-art/node-service/log.txt', 'parentPath :' + parentPath + '\n', () => {});

        //   fsPro.moveSync(fullPath, './' + parentPath, {
        //   overwrite: true
        // });
        spawn('mv', [fullPath, parentPath]);

        // moveData(fullPath, parentPath);
      }
    });
    await Promise.all(sourceMap);
    await processTransaction.commit();
    ctx.body = {
      status: 1,
      message: 'SUCCESS'
    };
  } catch (error) {
    const logsDir = `temp_upload/${projectData.project_name}/${projectData.project_name}.logs`;
    // call for document process log
    createDocumentLog(transactionId, logsDir, 'error');
    await processTransaction.rollback();
    ctx.throw((error as any).status ? (error as any).status : 500, `Error: ${(error as any).message}`);
  }
};

//*file upload controller

export const uploadFile = async (ctx: any) => {
  const {
    files: { file }
  } = ctx.request;

  const { transactionId, project_id } = ctx.request.body;

  const projectData = await ctx.db.tblProjects.findOne({
    where: {
      id: project_id ? project_id : 1
    }
  });

  const transaction = transactionId ? transactionId : Date.now();

  //check

  const logsDir = `temp_upload/${projectData.project_name}/${projectData.project_name}.logs`;

  const project = projectData.project_name;

  const user = 'user_1';
  const tempPath = './temp_upload';
  const projectPath = project;
  const userPath = user;
  const basePath = `${tempPath}/${projectPath}/${userPath}`;

  try {
    let destFile = `${basePath}/${replaceSpace(file.name)}`;
    const destDir = path.dirname(destFile);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    } else {
      console.log('Relative directory already exist');
    }
    if (fs.existsSync(destFile)) {
      cleanDir(destFile);
    }
    fs.copyFileSync(file.path, destFile);
    ctx.body = {
      status: 1,
      data: { file: { path: destFile } }
    };
    // call for document upload log
    createDocumentLog(transaction, logsDir, 'ip');
  } catch (error) {
    ctx.throw(`Error: ${(error as any).message}`);
  }
};

//*Move files function

export const moveDocuments = async (
  currentLoc: string,
  targetLoc: string,
  isReplace = false,
  replaceData: any = {}
) => {
  /**
   * TODO:this method will handle other storage types also.
   */
  if (isReplace) {
    const parts = currentLoc.split('/');
    // rename
    fsPro.moveSync(`${targetLoc}/${replaceData.title}`, `${targetLoc}/${replaceData.title}.${replaceData.version}`);
    fsPro.moveSync(currentLoc, targetLoc, {
      overwrite: true
    });
  } else {
    fsPro.moveSync(currentLoc, targetLoc, {
      overwrite: true
    });
  }
};

/** entry-Log for documents */
const createDocumentLog = async (transactionId: string, projectPath: string, type: 'ip' | 'done' | 'error') => {
  if (!fs.existsSync(projectPath)) {
    fs.mkdirSync(projectPath, { recursive: true });
  }
  const file = `${projectPath}/${transactionId ? transactionId : Date.now()}.${type}`;
  fs.writeFile(file, '', () => {});
};

/** replace blank space */
/** * TODO */
const replaceSpace = (input: string) => {
  return input.replace(/ /g, '_');
};

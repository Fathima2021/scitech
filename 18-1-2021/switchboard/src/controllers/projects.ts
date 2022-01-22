import Koa from 'koa';
import Sequelize from 'sequelize';
import fs from 'fs';
// @ts-ignore
import dirTree from 'directory-tree';
import {
  copyDir,
  copyFile,
  createFolder,
  moveData,
  moveFile,
  renameData,
  validateNotExistPath
} from '../utils/filesystem';
import { createError } from '../utils/createError';
import { deleteDirtree } from '../utils/deleteDirTree';
import { Json } from 'sequelize/types/lib/utils';
import { ProjectService } from '../services';

/** Projects controller  */

/** fetch all projects list */

export const getProjectsList = async (ctx: Koa.Context) => {
  const projects = await ctx.db.tblProjects.findAll();
  ctx.body = { projects };
};

/** fetch all cases list by project */

export const getCasesListByProject = async (ctx: Koa.Context) => {
  const { project_id } = ctx.query;
  try {
    if (!project_id) {
      createError(400, 'Project ID is required!');
    }

    const projectData = await ctx.db.tblProjects.findOne({
      where: {
        id: project_id
      }
    });

    if (!projectData) {
      createError(400, 'Project Id is invalid!');
    }

    const cases = await ctx.rawDb.query(
      `SELECT case_id, project_name, case_name, tenant_id, project_id, description, created, modified, created_by, modified_by, status
    FROM tblProjectCase WHERE  project_id = ${project_id}`,
      { type: ctx.rawDb.QueryTypes.SELECT }
    );
    ctx.body = { cases };
  } catch (error) {
    ctx.throw(`Error: ${(error as any).message}`);
  }
};

/** fetch all root folders  */

export const getAllRootFolders = async (ctx: Koa.Context) => {
  const { case_id } = ctx.query;
  const projects = await ctx.rawDb.query(
    `select * from tblLibraryItems tli, tblLibraryItemTree tlit
    where tli.case_id = ${case_id ? case_id : 1}
    and status = 1
    and tli.library_item_id = tlit.library_item_id
    and tlit.parent_id = 0
    order by CASE type
        WHEN 'folder' THEN '1'
        WHEN 'docx' THEN '2'
        WHEN 'pdf' THEN '3'
        WHEN 'jpg' THEN '4'
        WHEN 'xlsx' THEN '5'
        WHEN 'txt' THEN '6'
        ELSE '2'
    END asc,
    CASE owned_by
        WHEN 'system' THEN '1'
        WHEN 'user' THEN '2'
        ELSE '2'
    END asc,cast(title as varchar) asc`,
    { type: ctx.rawDb.QueryTypes.SELECT }
  );

  ctx.body = { projects };
};

/** fetch child folders by Id  */

export const getChildFoldersById = async (ctx: Koa.Context) => {
  const { parent, case_id } = ctx.query;
  const projects = await ctx.rawDb.query(
    `select * from tblLibraryItems tli, tblLibraryItemTree tlit
    where tli.case_id = ${case_id ? case_id : 1}
    and status = 1
    and tli.library_item_id = tlit.library_item_id
    and tlit.parent_id = ${parent ? parent : 0}
    order by CASE type
        WHEN 'folder' THEN '1'
        WHEN 'docx' THEN '2'
        WHEN 'pdf' THEN '3'
        WHEN 'jpg' THEN '4'
        WHEN 'xlsx' THEN '5'
        WHEN 'txt' THEN '6'
        ELSE '2'
    END asc,
    CASE owned_by
        WHEN 'system' THEN '1'
        WHEN 'user' THEN '2'
        ELSE '2'
    END asc,cast(title as varchar) asc`,
    { type: ctx.rawDb.QueryTypes.SELECT }
  );

  ctx.body = { projects };
};

/** Get Project Tree Data By Id */
export const getProjectTreeById = async (ctx: Koa.Context) => {
  const { project_id, case_id, user_id } = ctx.query;
  try {
    if (case_id) {
      let data = await ctx.db.tblLibraryItems.findAll({
        where: {
          case_id: case_id
        },
        include: [
          {
            model: ctx.db.tblLibraryItemTree,
            attributes: ['parent_id']
          }
        ]
      });
      data = data.map((obj: any) => {
        obj.dataValues['parent_id'] = obj.dataValues.tblLibraryItemTrees[0].parent_id;
        delete obj.dataValues.tblLibraryItemTrees;
        return obj.dataValues;
      });
      let treeData = treeify(data, 'library_item_id', 'parent_id', 'child');
      ctx.body = { status: 1, data: treeData };
    } else {
      ctx.throw('case_id required!');
    }
  } catch (error) {
    ctx.throw(`Error: ${(error as any).message}`);
  }
};

/** Export whole project By Id */
export const exportProject = async (ctx: Koa.Context) => {
  const { project_id, case_id, user_id, isLogged } = ctx.query;
  try {
    if (case_id) {
      let data = await ctx.db.tblLibraryItems.findAll({
        where: {
          case_id: case_id,
          status: 1
        },
        include: [
          {
            model: ctx.db.tblLibraryItemTree,
            attributes: ['parent_id']
          }
        ]
      });

      let newdata = data.map((obj: any) => {
        obj.dataValues['parent_id'] = obj.dataValues.tblLibraryItemTrees[0]
          ? obj.dataValues.tblLibraryItemTrees[0].parent_id
          : 0;
        delete obj.dataValues.tblLibraryItemTrees;
        return obj.dataValues;
      });

      let treeData = treeify(newdata, 'library_item_id', 'parent_id', 'child');

      if (isLogged) {
        const historyLog = await ctx.db.tblLibraryItemsHistory.create({
          object_id: '',
          object_type: 'export_data',
          title: '',
          tenant_id: 0,
          case_id: 0,
          item_version: 0,
          is_secured: 0,
          created: Sequelize.fn('GETDATE'),
          created_by: ctx.user.email,
          comments: `data exported by ${ctx.user.email}`,
          file_path: ''
        });

        if (!historyLog) {
          createError(500, 'internal server error');
        }
      }

      ctx.body = { status: 1, data: treeData };
    } else {
      ctx.throw('case_id required!');
    }
  } catch (error) {
    ctx.throw(`Error: ${(error as any).message}`);
  }
};

/** Get Tree structure method */

const treeify = (list: any, idAttr: any, parentAttr: any, childrenAttr: any) => {
  if (!idAttr) idAttr = 'library_item_id';
  if (!parentAttr) parentAttr = 'parent_id';
  if (!childrenAttr) childrenAttr = 'child';
  var treeList: any = [];
  var lookup: any = {};

  list.forEach(function (obj: any) {
    lookup[obj[idAttr]] = obj;
    obj[childrenAttr] = [];
  });

  list.forEach(function (obj: any) {
    if (obj.status !== 0) {
      if (obj[parentAttr] != 0) {
        if (lookup[obj[parentAttr]] !== undefined) {
          lookup[obj[parentAttr]][childrenAttr].push(obj);
        } else {
          treeList.push(obj);
        }
      } else {
        treeList.push(obj);
      }
    }
  });
  return treeList;
};

/** Copy-paste Controller */

export const copyPasteItems = async (ctx: any) => {
  const { sourceFiles, destination, case_id } = ctx.request.body;
  const copyTransaction = await ctx.rawDb.transaction();
  try {
    if (sourceFiles && destination) {
      const sourceMap = sourceFiles.map(async (object: any) => {
        const data = await ctx.db.tblLibraryItems.findOne({
          where: {
            library_item_id: object.itemId
          }
        });
        if (data.dataValues) {
          // if source item is directory
          if (fs.lstatSync(object.path).isDirectory()) {
            const filteredTree = dirTree(object.path, {
              // @ts-ignore
              attributes: ['size', 'type', 'extension']
            });
            const inputPath = object.path;
            let pathArray = inputPath.split('/');
            pathArray.pop();
            const basePath = pathArray.join('/');

            const getData = async (data: any = {}, i = 0, isFirstDoc = false) => {
              const nParentPath = data.path.replace(basePath, destination.path);
              // fetch item details for linked to the path

              fs.appendFile('/root/patent-art/node-service/log.txt', 'nParentPath = ' + nParentPath, () => {});
              fs.appendFile('/root/patent-art/node-service/log.txt', 'inputPath = ' + object.path, () => {});
              //const findData = await ctx.db.tblLibraryItems.findOne({
              //  where: {
              //      file_path: nParentPath
              //     }
              // });

              //  const Data = await ctx.rawDb.query(
              //    `select *
              //     from tblLibraryItems tli
              //       where tli.file_path = '${inputPath}'`,
              //     { type: ctx.rawDb.QueryTypes.SELECT }
              //  );

              // const findData: any = Data ? { dataValues: Data[0] } : undefined;

              //let currentTitleName:any;
              //if (findData.dataValues) {
              // currentTitleName = findData.dataValues.title;
              //}else
              //{
              //  createError(400, 'source Items path not valid!');
              //}

              if (data.type === 'directory') {
                const parts = nParentPath.split('/');
                // library table insert
                const directory = await ctx.db.tblLibraryItems.create(
                  {
                    case_id: case_id ? case_id : 1,
                    title: isFirstDoc ? object.title : parts[parts.length - 1],
                    //title: isFirstDoc ? object.title : currentTitleName,
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
                  { transaction: copyTransaction }
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
                  { transaction: copyTransaction }
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
                    comments: 'file copy/paste',
                    file_path: directory.file_path
                  },
                  { transaction: copyTransaction }
                );
                const childItems = data.children.map(async (x: any) => {
                  return getData(x, directory.library_item_id);
                });
                await Promise.all(childItems);
              } else if (data.type === 'file') {
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
                  { transaction: copyTransaction }
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
                  { transaction: copyTransaction }
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
                    comments: 'file copy/paste',
                    file_path: itemPlacement.file_path
                  },
                  { transaction: copyTransaction }
                );
                return;
              }
            };

            await getData(filteredTree, destination.itemId, true);
            // copy directory to destination
            const tempParts = object.path.split('/');
            const temppathName = tempParts[tempParts.length - 1];
            await copyDir(object.path, `${destination.path}/${temppathName}`);
          }
          // if source item is single file
          else {
            // check if isreplace
            if (!object.isReplace) {
              let tempPart = object.path.split('/');
              let temppathName = tempPart[tempPart.length - 1];
              // library table insert
              const directory = await ctx.db.tblLibraryItems.create(
                {
                  case_id: case_id ? case_id : 1,
                  title: object.title,
                  is_secured: 0,
                  tenant_id: 1,
                  item_version: 1,
                  file_path: `${destination.path}/${temppathName}`,
                  created: Sequelize.fn('GETDATE'),
                  modified: Sequelize.fn('GETDATE'),
                  created_by: `${ctx.user.email}`,
                  modified_by: `${ctx.user.email}`,
                  status: 1,
                  type: data.dataValues.type,
                  size: data.dataValues.size,
                  in_use: 0,
                  tag: 'test',
                  keywords: 'test',
                  check_in_status: null,
                  check_out_by: null,
                  name: object.title,
                  owned_by: 'user'
                },
                { transaction: copyTransaction }
              );
              // library tree table insert
              await ctx.db.tblLibraryItemTree.create(
                {
                  library_item_id: directory.library_item_id,
                  id: directory.library_item_id,
                  parent_id: destination.itemId,
                  tenant_id: directory.tenant_id,
                  item_version: directory.item_version
                },
                { transaction: copyTransaction }
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
                  comments: 'file copy/paste',
                  file_path: directory.file_path
                },
                { transaction: copyTransaction }
              );
            } else {
              // find items by path.
              const findData = await ctx.db.tblLibraryItems.findOne({
                where: {
                  file_path: `${destination.path}/${object.title}`
                }
              });

              renameData(
                `${destination.path}/${object.title}`,
                `${destination.path}/${object.title}.${findData.dataValues.item_version}`
              );

              // update version & size - history insert log
              if (findData.dataValues) {
                const updatedata = await ctx.db.tblLibraryItems.update(
                  { item_version: findData.dataValues.item_version + 1, size: data.dataValues.size },
                  {
                    where: {
                      library_item_id: findData.dataValues.library_item_id
                    },
                    transaction: copyTransaction
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
                    transaction: copyTransaction
                  }
                );
              }
            }
            // copy file to destination
            copyFile(object.path, destination.path);
          }
        } else {
          throw new Error('file not exist');
        }
      });
      await Promise.all(sourceMap);
      await copyTransaction.commit();
      ctx.body = { status: 1, message: 'SUCCESS' };
    }
  } catch (error) {
    await copyTransaction.rollback();
    ctx.throw((error as any).status ? (error as any).status : 500, (error as any).message);
  }
};

/** Cut-paste Controller */
export const cutPasteItems = async (ctx: any) => {
  fs.writeFile('/root/patent-art/node-service/log.txt', 'cutPasteItems started', () => {});

  const { sourceFiles, destination, case_id } = ctx.request.body;
  //const copyTransaction = await ctx.rawDb.transaction();
  try {
    if (sourceFiles && destination) {
      fs.appendFile(
        '/root/patent-art/node-service/log.txt',
        'sourceFiles :' + JSON.stringify(sourceFiles) + '\n',
        () => {}
      );
      fs.appendFile(
        '/root/patent-art/node-service/log.txt',
        'destination :' + JSON.stringify(destination) + '\n',
        () => {}
      );

      const sourceMap = sourceFiles.map(async (object: any) => {
        const data = await ctx.db.tblLibraryItems.findOne({
          where: {
            library_item_id: object.itemId
          }
        });
        fs.appendFile('/root/patent-art/node-service/log.txt', 'data :' + JSON.stringify(data) + '\n', () => {});

        if (data.dataValues) {
          const caseId = data.dataValues.case_id;
          let existingItemId: any = null;
          let itemVersion: any = null;
          let existingFilePath: any = null;
          // const existingFileEntry = await ctx.rawDb.query(
          //   `select a.library_item_id, a.item_version, a.file_path from patentartlocal.dbo.tblLibraryItems a, tblLibraryItemTree tlit
          //   where a.library_item_id  =tlit.library_item_id
          //   and tlit.parent_id  = ${destination.itemId}
          //   and a.title like '${object.title}'
          //   and a.status = 1;
          //   `,
          //   { type: ctx.rawDb.QueryTypes.SELECT }
          // );

          fs.appendFile('/root/patent-art/node-service/log.txt', 'existingFileEntry if condition :' + '\n', () => {});

          // if (existingFileEntry && existingFileEntry.length > 0) {
          //   existingItemId = existingFileEntry[0].library_item_id;
          //   itemVersion = existingFileEntry[0].item_version;
          //   existingFilePath = existingFileEntry[0].file_path;
          //   // await deleteDirtree(ctx, [{ itemId: existingItemId }], copyTransaction);
          //   fs.appendFile(
          //     '/root/patent-art/node-service/log.txt',
          //     'existingItemId :' + existingItemId + '\n',
          //     () => {}
          //   );
          // }

          // if source item is directory
          if (fs.lstatSync(object.path).isDirectory()) {
            fs.appendFile('/root/patent-art/node-service/log.txt', 'if source item is directory :' + '\n', () => {});

            const filteredTree = dirTree(object.path, {
              // @ts-ignore
              attributes: ['size', 'type', 'extension']
            });
            const inputPath = object.path;
            let pathArray = inputPath.split('/');
            pathArray.pop();
            const basePath = pathArray.join('/');
            const randomPath = Math.floor(Math.random() * (99 - 11 + 1) + 11);
            const getData = async (data: any = {}, i = 0, isFirstDoc = false) => {
              const nParentPath = data.path.replace(basePath, destination.path);
              if (data.type === 'directory') {
                fs.appendFile('/root/patent-art/node-service/log.txt', ' directory :' + '\n', () => {});

                const parts = nParentPath.split('/');
                // library table insert
                const directory = await ctx.db.tblLibraryItems.create(
                  {
                    case_id: caseId,
                    title: isFirstDoc ? object.title : parts[parts.length - 1],
                    is_secured: 0,
                    tenant_id: 1,
                    item_version: 1,
                    file_path: `${nParentPath}${randomPath}`,
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
                  }
                  //,
                  //  { transaction: copyTransaction }
                );
                // library tree table insert
                await ctx.db.tblLibraryItemTree.create(
                  {
                    library_item_id: directory.library_item_id,
                    id: directory.library_item_id,
                    parent_id: i,
                    tenant_id: 1,
                    item_version: 1
                  }
                  //,
                  // { transaction: copyTransaction }
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
                    comments: 'file copy/paste',
                    file_path: directory.file_path
                  }
                  //,
                  //{ transaction: copyTransaction }
                );

                const childItems = data.children.map(async (x: any) => {
                  return getData(x, directory.library_item_id);
                });
                await Promise.all(childItems);
              } else if (data.type === 'file') {
                fs.appendFile('/root/patent-art/node-service/log.txt', ' file :' + '\n', () => {});

                // library table insert
                const itemPlacement = await ctx.db.tblLibraryItems.create(
                  {
                    case_id: caseId,
                    title: data.name,
                    is_secured: 0,
                    tenant_id: 1,
                    item_version: 1,
                    file_path: `${nParentPath}${randomPath}`,
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
                  }
                  //,
                  // { transaction: copyTransaction }
                );
                // library tree table insert
                await ctx.db.tblLibraryItemTree.create(
                  {
                    library_item_id: itemPlacement.library_item_id,
                    id: itemPlacement.library_item_id,
                    parent_id: i,
                    tenant_id: 1,
                    item_version: 1
                  }
                  //,
                  //{ transaction: copyTransaction }
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
                    comments: 'file copy/paste',
                    file_path: itemPlacement.file_path
                  }
                  //,
                  //{ transaction: copyTransaction }
                );
                return;
              }
            };
            fs.appendFile('/root/patent-art/node-service/log.txt', 'getdata for sourceFiles :', () => {});

            await getData(filteredTree, destination.itemId, true);
            fs.appendFile(
              '/root/patent-art/node-service/log.txt',
              'sourceFiles:' + JSON.stringify(sourceFiles) + '\n',
              () => {}
            );

            //await deleteDirtree(ctx, sourceItems, copyTransaction);

            // copy directory to destination
            const tempParts = object.path.split('/');
            const temppathName = tempParts[tempParts.length - 1];
            await copyDir(object.path, `${destination.path}/${temppathName}${randomPath}`);
          }
          // if source item is single file
          else {
            fs.appendFile('/root/patent-art/node-service/log.txt', 'if source item is file:' + '\n', () => {});

            // check if isreplace
            // if (!object.isReplace) {
            let tempPart = object.path.split('/');
            let temppathName = tempPart[tempPart.length - 1];
            // library table insert
            const directory = await ctx.db.tblLibraryItems.create(
              {
                case_id: caseId,
                title: object.title,
                is_secured: 0,
                tenant_id: 1,
                item_version: 1,
                file_path: `${destination.path}/${temppathName}`,
                created: Sequelize.fn('GETDATE'),
                modified: Sequelize.fn('GETDATE'),
                created_by: `${ctx.user.email}`,
                modified_by: `${ctx.user.email}`,
                status: 1,
                type: data.dataValues.type,
                size: data.dataValues.size,
                in_use: 0,
                tag: 'test',
                keywords: 'test',
                check_in_status: null,
                check_out_by: null,
                name: object.title,
                owned_by: 'user'
              }
              //,
              //. { transaction: copyTransaction }
            );
            // library tree table insert
            await ctx.db.tblLibraryItemTree.create(
              {
                library_item_id: directory.library_item_id,
                id: directory.library_item_id,
                parent_id: destination.itemId,
                tenant_id: directory.tenant_id,
                item_version: directory.item_version
              }
              //,
              // { transaction: copyTransaction }
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
                comments: 'file copy/paste',
                file_path: directory.file_path
              }
              //,
              //{ transaction: copyTransaction }
            );
            // } else {
            //   // find items by path.
            //   const findData = await ctx.db.tblLibraryItems.findOne({
            //     where: {
            //       library_item_id: existingItemId
            //     }
            //   });
            //   renameData(
            //     `${destination.path}/${object.title}`,
            //     `${destination.path}/${object.title}.${findData.dataValues.item_version}`
            //   );

            //   // update version & size - history insert log
            //   if (findData && findData.dataValues) {
            //     const updatedata = await ctx.db.tblLibraryItems.update(
            //       { item_version: findData.dataValues.item_version + 1, size: data.dataValues.size },
            //       {
            //         where: {
            //           library_item_id: findData.dataValues.library_item_id
            //         },
            //         transaction: copyTransaction
            //       }
            //     );
            //     // library history table log insert
            //     await ctx.db.tblLibraryItemsHistory.create(
            //       {
            //         object_id: findData.dataValues.library_item_id,
            //         object_type: 'library_item',
            //         title: findData.dataValues.title,
            //         tenant_id: findData.dataValues.tenant_id,
            //         case_id: findData.dataValues.case_id,
            //         item_version: findData.dataValues.item_version + 1,
            //         is_secured: findData.dataValues.item_version,
            //         created: Sequelize.fn('GETDATE'),
            //         created_by: findData.dataValues.created_by,
            //         comments: 'file version updated',
            //         file_path: findData.dataValues.file_path
            //       },
            //       {
            //         transaction: copyTransaction
            //       }
            //     );
            //   }
            // }
            // copy file to destination
            copyFile(object.path, destination.path);
            fs.appendFile('/root/patent-art/node-service/log.txt', 'if source item is file end :' + '\n', () => {});
          }
          fs.appendFile('/root/patent-art/node-service/log.txt', 'deleteDirtree started', () => {});

          // if (sourceFiles) {
          //   const sourceMap = sourceFiles.map(async (document: any) => {
          //     const removeDoc = async (Id: any) => {
          //       const docData = await ctx.db.tblLibraryItems.findOne({
          //         where: {
          //           library_item_id: Id
          //         }
          //       });

          //       fs.appendFile('/root/patent-art/node-service/log.txt', 'deleteDirtree processing', () => {});

          //       if (!docData) {
          //         createError(400, 'Source file not found or its already deleted!');
          //       }

          //       if (docData.dataValues && docData.dataValues.type === 'folder') {
          //         // // delete files from storage
          //         // if (fs.existsSync(docData.dataValues.file_path)) {
          //         //   fs.rmdirSync(docData.dataValues.file_path, { recursive: true });
          //         // }

          //         await ctx.db.tblLibraryItems.update(
          //           { status: 0 },

          //           {
          //             where: {
          //               library_item_id: docData.dataValues.library_item_id
          //             }
          //             //,
          //             //transaction: copyTransaction
          //           }
          //         );
          //         fs.appendFile('/root/patent-art/node-service/log.txt', 'deleteDirtree processing', () => {});

          //         // library history table log insert
          //         await ctx.db.tblLibraryItemsHistory.create(
          //           {
          //             object_id: docData.dataValues.library_item_id,
          //             object_type: 'library_item',
          //             title: docData.dataValues.title,
          //             tenant_id: docData.dataValues.tenant_id,
          //             case_id: docData.dataValues.case_id,
          //             item_version: docData.dataValues.item_version,
          //             is_secured: docData.dataValues.item_version,
          //             created: Sequelize.fn('GETDATE'),
          //             created_by: docData.dataValues.created_by,
          //             comments: `file deleted by ${ctx.user.email}`,
          //             file_path: docData.dataValues.file_path
          //           }
          //           //,
          //           // { transaction: copyTransaction }
          //         );

          //         let childItem = await ctx.db.tblLibraryItemTree.findAll({
          //           where: {
          //             parent_id: Id
          //           }
          //         });
          //         if (childItem) {
          //           childItem = childItem.map((obj: any) => {
          //             removeDoc(obj.dataValues['id']);
          //             return obj.dataValues;
          //           });
          //         }
          //       } else {
          //         await ctx.db.tblLibraryItems.update(
          //           { status: 0 },
          //           {
          //             where: {
          //               library_item_id: Id
          //             }
          //             //,
          //             //transaction: copyTransaction
          //           }
          //         );

          //         // library history table log insert
          //         await ctx.db.tblLibraryItemsHistory.create(
          //           {
          //             object_id: docData.dataValues.library_item_id,
          //             object_type: 'library_item',
          //             title: docData.dataValues.title,
          //             tenant_id: docData.dataValues.tenant_id,
          //             case_id: docData.dataValues.case_id,
          //             item_version: docData.dataValues.item_version,
          //             is_secured: docData.dataValues.item_version,
          //             created: Sequelize.fn('GETDATE'),
          //             created_by: docData.dataValues.created_by,
          //             comments: `file deleted by ${ctx.user.email}`,
          //             file_path: docData.dataValues.file_path
          //           }
          //           //,
          //           // { transaction: copyTransaction }
          //         );
          //       }
          //     };
          //     fs.appendFile('/root/patent-art/node-service/log.txt', 'removeDoc started' + document.itemId, () => {});

          //     removeDoc(document.itemId);
          //   });
          //   await Promise.all(sourceMap);
          // }
        } else {
          throw new Error('file not exist');
        }
      });

      await Promise.all(sourceMap);
      //await copyTransaction.commit();
      //axios call to delte

      const projectService = new ProjectService();

      const sourceItems = sourceFiles.map((item: any) => {
        return { itemId: item.itemId };
      });

      const token = ctx.request.get('authorization');

      console.log('sourceItems', sourceItems);

      await projectService.deleteItem({ sourceFiles: sourceItems }, token);

      ctx.body = { status: 1, message: 'SUCCESS' };
    }
  } catch (error) {
    // await copyTransaction.rollback();
    ctx.throw((error as any).status ? (error as any).status : 500, (error as any).message);
  }
};
// export const cutPasteItems = async (ctx: Koa.Context) => {
//   const { sourceFiles, destination, case_id } = ctx.request.body;
//   const cutTransaction = await ctx.rawDb.transaction();
//   try {
//     if (sourceFiles && sourceFiles.length > 0 && destination) {
//       const sourceMap = sourceFiles.map(async (object: any) => {
//         if (!object || !object.itemId) {
//           createError(400, 'source files not found!');
//         } else {
//           let replaceObj: { title: string; version: any } = { title: '', version: 1 };
//           const data = await ctx.db.tblLibraryItems.findOne({
//             where: {
//               library_item_id: object.itemId
//             }
//           });

//           if (data.dataValues) {
//             // if source item is directory
//             if (fs.lstatSync(object.path).isDirectory()) {
//               const filteredTree = dirTree(object.path, {
//                 // @ts-ignore
//                 attributes: ['size', 'type', 'extension']
//               });
//               const inputPath = object.path;
//               let pathArray = inputPath.split('/');
//               pathArray.pop();
//               const basePath = pathArray.join('/');

//               // temp Ids array of source directory items (for delete opeartions)
//               let tempDocumentIds: any = [];

//               const getData = async (data: any = {}, i = 0, isFirstDoc = false) => {
//                 // find items by path.
//                 const findData = await ctx.db.tblLibraryItems.findOne({
//                   where: {
//                     file_path: data.path
//                   }
//                 });

//                 if (findData.dataValues) {
//                   tempDocumentIds.push(findData.dataValues.library_item_id);
//                 }
//                 const nParentPath = data.path.replace(basePath, destination.path);
//                 if (data.type === 'directory') {
//                   const parts = nParentPath.split('/');
//                   // if isReplace is true
//                   if (object.isReplace && fs.existsSync(nParentPath)) {
//                     // find items by path.
//                     const findData = await ctx.db.tblLibraryItems.findOne({
//                       where: {
//                         file_path: nParentPath
//                       }
//                     });

//                     // update version & size - history insert log
//                     if (findData.dataValues) {
//                       if (isFirstDoc) {
//                         replaceObj = { version: findData.dataValues.item_version, title: findData.dataValues.title };
//                       }

//                       const updateData = await ctx.db.tblLibraryItems.update(
//                         { item_version: findData.dataValues.item_version + 1, size: data.size },
//                         {
//                           where: {
//                             library_item_id: findData.dataValues.library_item_id
//                           },
//                           transaction: cutTransaction
//                         }
//                       );

//                       // library history table log insert
//                       await ctx.db.tblLibraryItemsHistory.create(
//                         {
//                           object_id: findData.dataValues.library_item_id,
//                           object_type: 'library_item',
//                           title: findData.dataValues.title,
//                           tenant_id: findData.dataValues.tenant_id,
//                           case_id: findData.dataValues.case_id,
//                           item_version: findData.dataValues.item_version + 1,
//                           is_secured: findData.dataValues.item_version,
//                           created: Sequelize.fn('GETDATE'),
//                           created_by: findData.dataValues.created_by,
//                           comments: 'file version updated',
//                           file_path: findData.dataValues.file_path
//                         },
//                         { transaction: cutTransaction }
//                       );
//                     }

//                     const childItems = data.children.map(async (x: any) => {
//                       return getData(x, findData.dataValues.library_item_id);
//                     });
//                     await Promise.all(childItems);
//                   }
//                   // Replace is false
//                   else {
//                     // library table insert
//                     const directory = await ctx.db.tblLibraryItems.create(
//                       {
//                         case_id: case_id ? case_id : 1,
//                         title: isFirstDoc ? object.title : parts[parts.length - 1],
//                         is_secured: 0,
//                         tenant_id: 1,
//                         item_version: 1,
//                         file_path: nParentPath,
//                         created: Sequelize.fn('GETDATE'),
//                         modified: Sequelize.fn('GETDATE'),
//                         created_by: `${ctx.user.email}`,
//                         modified_by: `${ctx.user.email}`,
//                         status: 1,
//                         type: 'folder',
//                         size: data.size,
//                         in_use: 1,
//                         tag: 'test',
//                         keywords: 'test',
//                         check_in_status: null,
//                         check_out_by: null,
//                         name: parts[parts.length - 1],
//                         owned_by: 'user'
//                       },
//                       { transaction: cutTransaction }
//                     );

//                     // library tree table insert

//                     await ctx.db.tblLibraryItemTree.create(
//                       {
//                         library_item_id: directory.library_item_id,
//                         id: directory.library_item_id,
//                         parent_id: i,
//                         tenant_id: 1,
//                         item_version: 1
//                       },
//                       { transaction: cutTransaction }
//                     );

//                     // library history table log insert
//                     await ctx.db.tblLibraryItemsHistory.create(
//                       {
//                         object_id: directory.library_item_id,
//                         object_type: 'library_item',
//                         title: directory.title,
//                         tenant_id: directory.tenant_id,
//                         case_id: directory.case_id,
//                         item_version: directory.item_version,
//                         is_secured: directory.item_version,
//                         created: Sequelize.fn('GETDATE'),
//                         created_by: directory.created_by,
//                         comments: 'file cut/paste',
//                         file_path: directory.file_path
//                       },
//                       { transaction: cutTransaction }
//                     );

//                     const childItems = data.children.map(async (x: any) => {
//                       return getData(x, directory.library_item_id);
//                     });
//                     await Promise.all(childItems);
//                   }
//                   // if loop document type is single file
//                 } else if (data.type === 'file') {
//                   // if replace is true
//                   if (object.isReplace && fs.existsSync(nParentPath)) {
//                     // find items by path.
//                     const findData = await ctx.db.tblLibraryItems.findOne({
//                       where: {
//                         file_path: nParentPath
//                       }
//                     });

//                     // update version & size - history insert log
//                     if (findData.dataValues) {
//                       const updateData = await ctx.db.tblLibraryItems.update(
//                         { item_version: findData.dataValues.item_version + 1, size: data.size },
//                         {
//                           where: {
//                             library_item_id: findData.dataValues.library_item_id
//                           },
//                           transaction: cutTransaction
//                         }
//                       );

//                       // library history table log insert
//                       await ctx.db.tblLibraryItemsHistory.create(
//                         {
//                           object_id: findData.dataValues.library_item_id,
//                           object_type: 'library_item',
//                           title: findData.dataValues.title,
//                           tenant_id: findData.dataValues.tenant_id,
//                           case_id: findData.dataValues.case_id,
//                           item_version: findData.dataValues.item_version + 1,
//                           is_secured: findData.dataValues.item_version,
//                           created: Sequelize.fn('GETDATE'),
//                           created_by: findData.dataValues.created_by,
//                           comments: 'file version updated',
//                           file_path: findData.dataValues.file_path
//                         },
//                         { transaction: cutTransaction }
//                       );
//                     }
//                     return;
//                   }
//                   // if replace is false
//                   else {
//                     // library table insert
//                     const itemPlacement = await ctx.db.tblLibraryItems.create(
//                       {
//                         case_id: case_id ? case_id : 1,
//                         title: data.name,
//                         is_secured: 0,
//                         tenant_id: 1,
//                         item_version: 1,
//                         file_path: nParentPath,
//                         created: Sequelize.fn('GETDATE'),
//                         modified: Sequelize.fn('GETDATE'),
//                         created_by: `${ctx.user.email}`,
//                         modified_by: `${ctx.user.email}`,
//                         status: 1,
//                         type: data.extension.replace('.', ''),
//                         size: data.size,
//                         in_use: 1,
//                         tag: 'test',
//                         keywords: 'test',
//                         check_in_status: null,
//                         check_out_by: null,
//                         name: data.name,
//                         owned_by: 'user'
//                       },
//                       { transaction: cutTransaction }
//                     );

//                     // library tree table insert

//                     await ctx.db.tblLibraryItemTree.create(
//                       {
//                         library_item_id: itemPlacement.library_item_id,
//                         id: itemPlacement.library_item_id,
//                         parent_id: i,
//                         tenant_id: 1,
//                         item_version: 1
//                       },
//                       { transaction: cutTransaction }
//                     );

//                     // library history table log insert
//                     await ctx.db.tblLibraryItemsHistory.create(
//                       {
//                         object_id: itemPlacement.library_item_id,
//                         object_type: 'library_item',
//                         title: itemPlacement.title,
//                         tenant_id: itemPlacement.tenant_id,
//                         case_id: itemPlacement.case_id,
//                         item_version: itemPlacement.item_version,
//                         is_secured: itemPlacement.item_version,
//                         created: Sequelize.fn('GETDATE'),
//                         created_by: itemPlacement.created_by,
//                         comments: 'file cut/paste',
//                         file_path: itemPlacement.file_path
//                       },
//                       { transaction: cutTransaction }
//                     );
//                     return;
//                   }
//                 }
//               };
//               await getData(filteredTree, destination.itemId, true);

//               // delete from list & tree hierarchy
//               if (tempDocumentIds.length > 0) {
//                 await tempDocumentIds.forEach(async (Id: any) => {
//                   await ctx.db.tblLibraryItemTree.destroy({
//                     where: {
//                       id: Id
//                     },
//                     transaction: cutTransaction
//                   });

//                   await ctx.db.tblLibraryItems.destroy({
//                     where: {
//                       library_item_id: Id
//                     },
//                     transaction: cutTransaction
//                   });
//                 });
//               }
//               if (object.isReplace) {
//                 renameData(`${destination.path}`, `${destination.path}.${replaceObj.version}`);
//               }
//               const tempParts = object.path.split('/');
//               const temppathName = tempParts[tempParts.length - 1];
//               await moveData(object.path, `${destination.path}/${temppathName}`);
//             }
//             // if source item is file
//             else {
//               // check if isreplace false
//               if (!object.isReplace) {
//                 let tempPart = object.path.split('/');
//                 let temppathName = tempPart[tempPart.length - 1];
//                 // library table insert
//                 const directory = await ctx.db.tblLibraryItems.create(
//                   {
//                     case_id: case_id ? case_id : 1,
//                     title: object.title,
//                     is_secured: 0,
//                     tenant_id: 1,
//                     item_version: 1,
//                     file_path: `${destination.path}/${temppathName}`,
//                     created: Sequelize.fn('GETDATE'),
//                     modified: Sequelize.fn('GETDATE'),
//                     created_by: `${ctx.user.email}`,
//                     modified_by: `${ctx.user.email}`,
//                     status: 1,
//                     type: data.dataValues.type,
//                     size: data.dataValues.size,
//                     in_use: 0,
//                     tag: 'test',
//                     keywords: 'test',
//                     check_in_status: null,
//                     check_out_by: null,
//                     name: object.title,
//                     owned_by: 'user'
//                   },
//                   { transaction: cutTransaction }
//                 );

//                 // library tree table insert
//                 await ctx.db.tblLibraryItemTree.create(
//                   {
//                     library_item_id: directory.library_item_id,
//                     id: directory.library_item_id,
//                     parent_id: destination.itemId,
//                     tenant_id: directory.tenant_id,
//                     item_version: directory.item_version
//                   },
//                   { transaction: cutTransaction }
//                 );

//                 // library history table log insert
//                 await ctx.db.tblLibraryItemsHistory.create(
//                   {
//                     object_id: directory.library_item_id,
//                     object_type: 'library_item',
//                     title: directory.title,
//                     tenant_id: directory.tenant_id,
//                     case_id: directory.case_id,
//                     item_version: directory.item_version,
//                     is_secured: directory.item_version,
//                     created: Sequelize.fn('GETDATE'),
//                     created_by: directory.created_by,
//                     comments: 'file cut/paste',
//                     file_path: directory.file_path
//                   },
//                   { transaction: cutTransaction }
//                 );

//                 // delete from list & tree
//                 await ctx.db.tblLibraryItemTree.destroy({
//                   where: {
//                     id: object.itemId
//                   },
//                   transaction: cutTransaction
//                 });

//                 await ctx.db.tblLibraryItems.destroy({
//                   where: {
//                     library_item_id: object.itemId
//                   },
//                   transaction: cutTransaction
//                 });
//               }
//               //if replace true
//               else {
//                 // find items by path.
//                 const findData = await ctx.db.tblLibraryItems.findOne({
//                   where: {
//                     file_path: `${destination.path}/${object.title}`
//                   }
//                 });

//                 if (!findData) {
//                   ctx.throw('No File exist!');
//                 }

//                 renameData(
//                   `${destination.path}/${object.title}`,
//                   `${destination.path}/${object.title}.${findData.dataValues.item_version}`
//                 );

//                 // update version & size - history insert log
//                 if (findData.dataValues) {
//                   const updatedata = await ctx.db.tblLibraryItems.update(
//                     { item_version: findData.dataValues.item_version + 1, size: data.dataValues.size },
//                     {
//                       where: {
//                         library_item_id: findData.dataValues.library_item_id
//                       },
//                       transaction: cutTransaction
//                     }
//                   );

//                   // library history table log insert
//                   await ctx.db.tblLibraryItemsHistory.create(
//                     {
//                       object_id: findData.dataValues.library_item_id,
//                       object_type: 'library_item',
//                       title: findData.dataValues.title,
//                       tenant_id: findData.dataValues.tenant_id,
//                       case_id: findData.dataValues.case_id,
//                       item_version: findData.dataValues.item_version + 1,
//                       is_secured: findData.dataValues.item_version,
//                       created: Sequelize.fn('GETDATE'),
//                       created_by: findData.dataValues.created_by,
//                       comments: 'file version updated',
//                       file_path: findData.dataValues.file_path
//                     },
//                     { transaction: cutTransaction }
//                   );

//                   // delete from list & tree
//                   await ctx.db.tblLibraryItemTree.destroy({
//                     where: {
//                       id: object.itemId
//                     },
//                     transaction: cutTransaction
//                   });

//                   await ctx.db.tblLibraryItems.destroy({
//                     where: {
//                       library_item_id: object.itemId
//                     },
//                     transaction: cutTransaction
//                   });
//                 }
//               }

//               moveFile(object.path, destination.path);
//             }
//           } else {
//             createError(400, 'sourcefiles invalid!');
//           }
//         }
//       });
//       await Promise.all(sourceMap);
//       await cutTransaction.commit();
//       ctx.body = { status: 1, Message: 'SUCCESS' };
//     } else {
//       createError(400, 'source files not found!');
//     }
//   } catch (error) {
//     await cutTransaction.rollback();
//     ctx.throw((error as any).status ? (error as any).status : 500, `Error: ${(error as any).message}`);
//   }
// };

/** Delete document By Id */

export const deleteFilesById = async (ctx: any) => {
  const { sourceFiles } = ctx.request.body;

  try {
    if (sourceFiles) {
      const sourceMap = sourceFiles.map(async (document: any) => {
        const removeDoc = async (Id: any) => {
          const docData = await ctx.db.tblLibraryItems.findOne({
            where: {
              library_item_id: Id
            }
          });

          if (!docData) {
            createError(400, 'Source file not found or its already deleted!');
          }

          if (docData.dataValues && docData.dataValues.type === 'folder') {
            // // delete files from storage
            // if (fs.existsSync(docData.dataValues.file_path)) {
            //   fs.rmdirSync(docData.dataValues.file_path, { recursive: true });
            // }

            await ctx.db.tblLibraryItems.update(
              { status: 0 },
              {
                where: {
                  library_item_id: docData.dataValues.library_item_id
                }
              }
            );

            // library history table log insert
            await ctx.db.tblLibraryItemsHistory.create({
              object_id: docData.dataValues.library_item_id,
              object_type: 'library_item',
              title: docData.dataValues.title,
              tenant_id: docData.dataValues.tenant_id,
              case_id: docData.dataValues.case_id,
              item_version: docData.dataValues.item_version + 1,
              is_secured: docData.dataValues.item_version,
              created: Sequelize.fn('GETDATE'),
              created_by: docData.dataValues.created_by,
              comments: `file deleted by ${ctx.user.email}`,
              file_path: docData.dataValues.file_path
            });

            let childItem = await ctx.db.tblLibraryItemTree.findAll({
              where: {
                parent_id: Id
              }
            });
            if (childItem) {
              childItem = childItem.map((obj: any) => {
                removeDoc(obj.dataValues['id']);
                return obj.dataValues;
              });
            }
          } else {
            await ctx.db.tblLibraryItems.update(
              { status: 0 },
              {
                where: {
                  library_item_id: Id
                }
              }
            );

            // library history table log insert
            await ctx.db.tblLibraryItemsHistory.create({
              object_id: docData.dataValues.library_item_id,
              object_type: 'library_item',
              title: docData.dataValues.title,
              tenant_id: docData.dataValues.tenant_id,
              case_id: docData.dataValues.case_id,
              item_version: docData.dataValues.item_version + 1,
              is_secured: docData.dataValues.item_version,
              created: Sequelize.fn('GETDATE'),
              created_by: docData.dataValues.created_by,
              comments: `file deleted by ${ctx.user.email}`,
              file_path: docData.dataValues.file_path
            });
          }
        };
        removeDoc(document.itemId);
      });
      await Promise.all(sourceMap);
      ctx.body = { status: 1, Message: 'SUCCESS' };
    }
  } catch (error) {
    ctx.throw((error as any).status ? (error as any).status : 500, `Error: ${(error as any).message}`);
  }
};

/** Rename document By Id */

export const renameFileById = async (ctx: Koa.Context) => {
  const { itemId, title } = ctx.request.body;
  const username = ctx.user.email;
  try {
    if (itemId && title) {
      const findData = await ctx.db.tblLibraryItems.findOne({
        where: {
          library_item_id: itemId
        }
      });

      if (!findData) {
        createError(500, 'item not found.');
      }

      const data = await ctx.db.tblLibraryItems.update(
        { title: title, name: title, item_version: findData.dataValues.item_version + 1 },
        {
          where: {
            library_item_id: itemId
          }
        }
      );
      if (data) {
        const newHistory = await ctx.db.tblLibraryItemsHistory.create({
          object_id: itemId,
          object_type: 'library_item',
          title: title,
          tenant_id: findData.dataValues.tenant_id,
          case_id: findData.dataValues.case_id,
          item_version: findData.dataValues.item_version + 1,
          is_secured: findData.dataValues.is_secured,
          created: Sequelize.fn('GETDATE'),
          created_by: username,
          comments: `file renamed by ${username}`,
          file_path: findData.dataValues.file_path
        });

        ctx.body = { status: 1, Message: 'SUCCESS' };
      } else {
        createError(400, 'file Id is invalid!');
      }
    } else {
      createError(400, 'file Id & title is required!');
    }
  } catch (error) {
    ctx.throw((error as any).status ? (error as any).status : 500, `Error: ${(error as any).message}`);
  }
};

/** Create New Folder */

export const createNewFolder = async (ctx: Koa.Context) => {
  const { parent, title, project_id, case_id } = ctx.request.body;
  const createTransaction = await ctx.rawDb.transaction();
  try {
    let parentPath;
    if (parent == undefined) {
      createError(400, 'parent Id is required!');
    }
    if (parent !== 0) {
      const parentData = await ctx.db.tblLibraryItems.findOne({
        where: {
          library_item_id: parent
        }
      });
      if (parentData) {
        parentPath = `${parentData.dataValues.file_path}/${Date.now()}_${title ? title : 'New_Folder'}`;
      } else {
        createError(400, 'parent not found or its deleted!');
      }
    } else {
      const projectData = await ctx.db.tblProjects.findOne({
        where: {
          id: project_id ? project_id : 1
        }
      });
      if (projectData) {
        parentPath = `${projectData.dataValues.target_base_directory}/${Date.now()}_${title ? title : 'New_Folder'}`;
      } else {
        createError(500, 'parent not found or its deleted!');
      }
    }
    if (title) {
      // library table insert
      const directory = await ctx.db.tblLibraryItems.create(
        {
          case_id: case_id ? case_id : 1,
          title: title ? title : 'New_Folder',
          is_secured: 0,
          tenant_id: 1,
          item_version: 1,
          file_path: parentPath,
          created: Sequelize.fn('GETDATE'),
          modified: Sequelize.fn('GETDATE'),
          created_by: `${ctx.user.email}`,
          modified_by: `${ctx.user.email}`,
          status: 1,
          type: 'folder',
          size: 0,
          in_use: 1,
          tag: 'test',
          keywords: 'test',
          check_in_status: null,
          check_out_by: null,
          name: title ? title : 'New Folder',
          owned_by: 'user'
        },
        { transaction: createTransaction }
      );
      // library tree table insert
      await ctx.db.tblLibraryItemTree.create(
        {
          library_item_id: directory.library_item_id,
          id: directory.library_item_id,
          parent_id: parent,
          tenant_id: 1,
          item_version: 1
        },
        { transaction: createTransaction }
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
          comments: `folder created by ${ctx.user.email}`,
          file_path: directory.file_path
        },
        { transaction: createTransaction }
      );
      validateNotExistPath('path is invalid', directory.file_path);
      createFolder(directory.file_path);
      if (directory) {
        await createTransaction.commit();
        ctx.body = { status: 1, Message: 'SUCCESS' };
      }
    } else {
      createError(400, 'title is required!');
    }
  } catch (error) {
    await createTransaction.rollback();
    ctx.throw((error as any).status ? (error as any).status : 500, `Error: ${(error as any).message}`);
  }
};

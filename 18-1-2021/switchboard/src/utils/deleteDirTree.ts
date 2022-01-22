import Koa from 'koa';
import Sequelize from 'sequelize';
import { createError } from '../utils/createError';

const deleteDirtree = async (ctx: any, sourceFiles: any, copyTransaction: any) => {
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
                // transaction: copyTransaction
              }
            );

            // library history table log insert
            await ctx.db.tblLibraryItemsHistory.create(
              {
                object_id: docData.dataValues.library_item_id,
                object_type: 'library_item',
                title: docData.dataValues.title,
                tenant_id: docData.dataValues.tenant_id,
                case_id: docData.dataValues.case_id,
                item_version: docData.dataValues.item_version,
                is_secured: docData.dataValues.item_version,
                created: Sequelize.fn('GETDATE'),
                created_by: docData.dataValues.created_by,
                comments: `file deleted by ${ctx.user.email}`,
                file_path: docData.dataValues.file_path
              }
              // { transaction: copyTransaction }
            );

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
                // transaction: copyTransaction
              }
            );

            // library history table log insert
            await ctx.db.tblLibraryItemsHistory.create(
              {
                object_id: docData.dataValues.library_item_id,
                object_type: 'library_item',
                title: docData.dataValues.title,
                tenant_id: docData.dataValues.tenant_id,
                case_id: docData.dataValues.case_id,
                item_version: docData.dataValues.item_version,
                is_secured: docData.dataValues.item_version,
                created: Sequelize.fn('GETDATE'),
                created_by: docData.dataValues.created_by,
                comments: `file deleted by ${ctx.user.email}`,
                file_path: docData.dataValues.file_path
              }
              // { transaction: copyTransaction }
            );
          }
        };
        removeDoc(document.itemId);
      });
      await Promise.all(sourceMap);
    }
  } catch (error) {
    ctx.throw((error as any).status ? (error as any).status : 500, `Error: ${(error as any).message}`);
  }
};

export { deleteDirtree };

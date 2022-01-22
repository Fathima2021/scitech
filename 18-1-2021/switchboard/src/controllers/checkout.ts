import Koa from 'koa';
import fs from 'fs';
import Sequelize from 'sequelize';
// import { moveDocuments } from './upload';
import { createError } from '../utils/createError';
import { moveData, renameData, validateExistPath } from '../utils/filesystem';

/** File checkin/out controller  */

/** File checkin */

export const fileCheckIn = async (ctx: Koa.Context) => {
  const { user_id, itemList } = ctx.request.body;
  const checkInTransaction = await ctx.rawDb.transaction();
  const username = ctx.user.email;
  try {
    // find items by id.
    if (itemList && itemList.length > 0) {
      let checkMap = itemList.map(async (object: any) => {
        const findData = await ctx.db.tblLibraryItems.findOne({
          where: {
            library_item_id: object.itemId
          }
        });

        if (!findData) {
          createError(400, 'item not found or its deleted!');
        }

        if (findData.dataValues.type === 'folder') {
          createError(400, 'only file is allowed!');
        }
        /* TODO-temp */
        if (findData.dataValues.check_in_status === 1 && findData.dataValues.check_out_by === username) {
          // rename old document with version
          renameData(
            findData.dataValues.file_path,
            `${findData.dataValues.file_path}.${findData.dataValues.item_version}`
          );

          // move & replace document
          let filestats;
          validateExistPath(`${object.tempPath}  file path not exist`, object.tempPath);

          filestats = fs.statSync(object.tempPath);
          moveData(object.tempPath, findData.dataValues.file_path);

          // update version & size - history insert log
          if (findData.dataValues) {
            const data = await ctx.db.tblLibraryItems.update(
              { check_in_status: 0, item_version: findData.dataValues.item_version + 1, size: filestats?.size },
              {
                where: {
                  library_item_id: findData.dataValues.library_item_id
                },
                transaction: checkInTransaction
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
                created_by: username,
                comments: `file check in by ${username}`,
                file_path: findData.dataValues.file_path
              },
              { transaction: checkInTransaction }
            );
          }
        } else {
          createError(400, 'Unauthorized action - user not have access to checkin this file!');
        }
      });
      await Promise.all(checkMap);
      await checkInTransaction.commit();
      ctx.body = { status: 1, message: 'SUCCESS' };
    }
  } catch (error) {
    await checkInTransaction.rollback();
    ctx.throw((error as any).status ? (error as any).status : 500, `Error: ${(error as any).message}`);
  }
};

/** file check out  */

export const fileCheckOut = async (ctx: Koa.Context) => {
  const { user_id, itemList } = ctx.request.body;
  const checkoutTransaction = await ctx.rawDb.transaction();
  const username = ctx.user.email;
  try {
    if (itemList && itemList.length > 0) {
      let checkMap = itemList.map(async (object: any) => {
        let data = await ctx.db.tblLibraryItems.update(
          { check_in_status: 1, check_out_by: username },
          {
            where: {
              library_item_id: object.itemId
            },
            transaction: checkoutTransaction
          }
        );
        if (!data) {
          createError(400, 'One or more files not present in database or its deleted!');
        }
      });
      await Promise.all(checkMap);
      await checkoutTransaction.commit();
      ctx.body = { status: 1, message: 'SUCCESS' };
    } else {
      createError(400, 'itemList is required!');
    }
  } catch (error) {
    await checkoutTransaction.rollback();
    ctx.throw((error as any).status ? (error as any).status : 500, `Error: ${(error as any).message}`);
  }
};

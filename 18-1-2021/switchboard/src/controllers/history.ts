import Koa from 'koa';
import { createError } from '../utils/createError';
import fs from 'fs';
import Sequelize from 'sequelize';
import { validateExistPath } from '../utils/filesystem';

/** File history controller  */

export const getFileHistory = async (ctx: Koa.Context) => {
  const { object_id, user, case_id, days, page, limit } = ctx.request.body;
  // let pageNum = page ? page : 1;
  // let numLimit = limit ? limit : 20;
  let daysCount = days && days > 0 ? days : 30;
  try {
    let queryString = `SELECT object_id,title,tenant_id,case_id,item_version,is_secured,created,created_by,comments,file_path,id,object_type from tblLibraryItemsHistory tlih WHERE created >= DATEADD(day,-${daysCount}, GETDATE())`;
    if (object_id) {
      queryString = queryString + ` and object_id = ${object_id}`;
    }
    if (user) {
      queryString = queryString + ` and created_by= '${user}'`;
    }
    if (case_id) {
      queryString = queryString + ` and case_id=${case_id}`;
    }
    queryString = queryString + ` order by created desc`;
    // queryString =
    //   queryString +
    //   `
    // OFFSET ${(pageNum - 1) * numLimit} ROWS
    // FETCH NEXT ${numLimit} ROWS ONLY
    // `;
    const historyData = await ctx.rawDb.query(queryString, { type: ctx.rawDb.QueryTypes.SELECT });
    ctx.body = { status: 1, historyData };
  } catch (error) {
    ctx.throw((error as any).status ? (error as any).status : 500, `Error: ${(error as any).message}`);
  }
};

/** File history summary */

export const getHistorySummary = async (ctx: Koa.Context) => {
  const { object_id, user, case_id, days, page, limit } = ctx.request.body;
  let daysCount = days && days > 0 ? days : 30;
  // let pageNum = page ? page : 1;
  // let numLimit = limit ? limit : 10;
  try {
    let queryString = `SELECT object_id  ,cast(title as varchar) title,max(created) created,max(item_version) item_version ,max(id) id from tblLibraryItemsHistory tlih WHERE created >= DATEADD(day,-${daysCount}, GETDATE())`;
    if (user) {
      queryString = queryString + ` and created_by= '${user}'`;
    }
    if (case_id) {
      queryString = queryString + ` and case_id=${case_id}`;
    }
    let groupByOrderByString = ' GROUP BY object_id , cast(title as varchar) order by 3 desc';
    queryString = queryString + groupByOrderByString;
    // queryString =
    //   queryString +
    //   `
    // OFFSET ${(pageNum - 1) * numLimit} ROWS
    // FETCH NEXT ${numLimit} ROWS ONLY
    // `;
    const data = await ctx.rawDb.query(queryString, { type: ctx.rawDb.QueryTypes.SELECT });
    ctx.body = { status: 1, data };
  } catch (error) {
    ctx.throw((error as any).status ? (error as any).status : 500, `Error: ${(error as any).message}`);
  }
};

/** File restore  */

export const fileRestore = async (ctx: Koa.Context) => {
  const { object_id, id } = ctx.request.body;
  const username = ctx.user.email;
  try {
    if (!object_id || !id) {
      createError(400, 'object_id and id is required!');
    }

    const historyData = await ctx.db.tblLibraryItemsHistory.findOne({
      where: {
        id: id
      }
    });

    if (!historyData) {
      createError(400, 'requested item not present in db.');
    }

    if (historyData.dataValues) {
      const libraryData = await ctx.db.tblLibraryItems.findOne({
        where: {
          library_item_id: object_id
        }
      });

      if (!libraryData) {
        createError(400, 'library item not found!');
      }

      validateExistPath('Requested library item not present in storage', historyData.dataValues.file_path);

      let stats = fs.statSync(historyData.dataValues.file_path);

      const updateValues = await ctx.db.tblLibraryItems.update(
        {
          title: historyData.dataValues.title,
          name: historyData.dataValues.name,
          item_version: libraryData.dataValues.item_version + 1,
          size: stats.size / 1024,
          modified: Sequelize.fn('GETDATE'),
          modified_by: username,
          file_path: historyData.dataValues.file_path,
          status: 1
        },
        {
          where: {
            library_item_id: historyData.dataValues.object_id
          }
        }
      );

      const newHistory = await ctx.db.tblLibraryItemsHistory.create({
        object_id: historyData.dataValues.object_id,
        object_type: 'library_item',
        title: historyData.dataValues.title,
        tenant_id: libraryData.dataValues.tenant_id,
        case_id: libraryData.dataValues.case_id,
        item_version: libraryData.dataValues.item_version + 1,
        is_secured: libraryData.dataValues.is_secured,
        created: Sequelize.fn('GETDATE'),
        created_by: username,
        comments: `file restored by ${username}`,
        file_path: historyData.dataValues.file_path
      });

      if (updateValues && newHistory) {
        ctx.body = { status: 1, message: 'SUCCESS' };
      } else {
        createError(500, 'operation not completed!');
      }
    }
  } catch (error) {
    ctx.throw((error as any).status ? (error as any).status : 500, `Error: ${(error as any).message}`);
  }
};

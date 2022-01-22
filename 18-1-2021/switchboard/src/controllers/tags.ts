import Koa from 'koa';
import { createError } from '../utils/createError';
const { Op } = require('sequelize');

/** File tags controller  */

/** Get taglist ByID */

export const getTagListById = async (ctx: Koa.Context) => {
  const { project_id, case_id } = ctx.query;
  try {
    const data = await ctx.db.tblTagMaster.findAll({
      where: {
        [Op.and]: [{ project_id: project_id ? project_id : '' }, { case_id: case_id ? case_id : null }]
      }
    });
    ctx.body = { status: 1, data };
  } catch (error) {
    ctx.throw((error as any).status ? (error as any).status : 500, `Error: ${(error as any).message}`);
  }
};

/** add tag items  */

export const addTagItems = async (ctx: Koa.Context) => {
  const { tagItems, libraryItems } = ctx.request.body;
  const createTransaction = await ctx.rawDb.transaction();
  try {
    const libraryMap = libraryItems.map(async (item: any) => {
      if (item) {
        let currentTags: any = [];
        const libItemData = await ctx.db.tblLibraryItems.findOne({
          where: {
            library_item_id: item.library_item_id
          }
        });
        if (!libItemData) {
          createError(400, 'No Item Found!');
        }

        tagItems.forEach((tag: any) => {
          if (tag) {
            currentTags.push(tag.tag);
          }
        });
        let tagsString;
        if (currentTags.length > 0) {
          tagsString = currentTags.join(',');
        }
        const document = await ctx.db.tblLibraryItems.update(
          { tag: tagsString },
          {
            where: {
              library_item_id: item.library_item_id
            },
            transaction: createTransaction
          }
        );
      }
    });
    await Promise.all(libraryMap);
    await createTransaction.commit();
    ctx.body = { status: 1, message: 'SUCCESS' };
  } catch (error) {
    await createTransaction.rollback();
    ctx.throw((error as any).status ? (error as any).status : 500, `Error: ${(error as any).message}`);
  }
};

/** add tags  */

export const addTags = async (ctx: Koa.Context) => {
  const { project_id, case_id, tagItems } = ctx.request.body;
  try {
    if (tagItems && tagItems.length > 0) {
      tagItems.forEach(async (object: any) => {
        let data = await ctx.db.tblTagMaster.create({
          project_id: project_id,
          case_id: case_id,
          tag_name: object.tag,
          is_deleted: 0
        });
      });
    }
    ctx.body = { status: 1, message: 'SUCCESS' };
  } catch (error) {
    ctx.throw((error as any).status ? (error as any).status : 500, `Error: ${(error as any).message}`);
  }
};

import { Context } from 'koa';
import { validateExistPath } from '../utils/filesystem';
import { dbFileCheck } from '../utils/dbfilecheckvalidator';

/**
 * Ensures all required data related to source exists in payload
 * Ensure source path exists in filesystem and database.
 * @param ctx
 * @param next
 */
export default async (ctx: Context, next: any) => {
  const destination = ctx.request.body;
  /**
   * Just check if all required data is available is request
   */

  if (!destination || !destination.title || !destination.itemId) {
    throw new Error('file title and Id is required!');
  }

  /**
   * Validate Database
   */
  const dbExist = await dbFileCheck(destination.itemId, ctx);
  if (!dbExist) {
    throw new Error("requested file doesn't have record in database or its removed!");
  }
  await next();
};

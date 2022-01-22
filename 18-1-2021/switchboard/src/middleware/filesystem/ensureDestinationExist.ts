import { Context } from 'koa';
import { validateExistPath } from '../../utils/filesystem';
import { dbFileCheck } from '../../utils/dbfilecheckvalidator';

/**
 * Ensures all required data related to source exists in payload
 * Ensure source path exists in filesystem and database.
 * @param ctx
 * @param next
 */
export default async (ctx: Context, next: any) => {
  const { destination } = ctx.request.body;

  /**
   * Just check if all required data is available is request
   */

  if (!destination || !destination.path || !destination.itemId) {
    throw new Error('Invalid destination path');
  }

  /**
   * Ensure file exist on disk, go one by one each,
   * TODO: check if required async
   * as file existence testing is fast by design so this may not be required
   */
  validateExistPath(`${destination.path} doesn't exist on disk`, destination.path);

  /**
   * Validate Database,
   * send the list of all files and wait for response,
   * then match the response length,
   * response length should be equal to sent array list
   */
  const dbExist = await dbFileCheck(destination.itemId, ctx);

  if (!dbExist) {
    throw new Error("destination doesn't have record in database");
  }
  await next();
};

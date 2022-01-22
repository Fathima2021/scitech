import { Context } from 'koa';
import { validateExistPath } from '../../utils/filesystem';
import { dbFilesCheck } from '../../utils/dbfilecheckvalidator';

/**
 * Ensures all required data related to source exists in payload
 * Ensure source path exists in filesystem and database.
 * @param ctx
 * @param next
 */
export default async (ctx: Context, next: any) => {
  const { sourceFiles } = ctx.request.body;

  /**
   * Just check if all required data is available is request
   */
  const filePathList = sourceFiles.map(async (file: any) => {
    if (!file || !file.path || !file.itemId) {
      throw new Error('Invalid file path');
    }
    return { path: file.path, id: file.itemId };
  });

  /**
   * Ensure file exist on disk, go one by one each,
   * TODO: check if required async
   * as file existence testing is fast by design so this may not be required
   */

  sourceFiles.map((file: any) => validateExistPath(`${file.path} doesn't exist on disk`, file.path));

  /**
   * Validate Database,
   * send the list of all files and wait for response,
   * then match the response length,
   * response length should be equal to sent array list
   */
  const dbExist = await dbFilesCheck(
    sourceFiles.map((x: any) => x.itemId),
    ctx
  );

  if (!dbExist || !dbExist.length || dbExist.length !== sourceFiles.length) {
    throw new Error("One or more files doesn't have record in database");
  }
  await next();
};

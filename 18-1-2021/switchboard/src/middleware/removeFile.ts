import { Context } from 'koa';
import { dbFilesCheck } from '../utils/dbfilecheckvalidator';

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
    if (!file || !file.itemId) {
      throw new Error('Invalid file');
    }
    return { id: file.itemId };
  });

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
    throw new Error("One or more files doesn't have record in database or its already deleted!");
  }
  await next();
};

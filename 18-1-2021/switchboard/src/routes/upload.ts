import koaBody from 'koa-body';
import Router from 'koa-joi-router';
import { processFiles, uploadFile } from '../controllers';
import { authorizeAzureAdToken, ensureRoleAccess, handleError } from '../middleware';

const router = Router();
router.prefix('/v1/upload');

/** Upload routes */

router.route([
  {
    method: 'POST',
    path: '/process-file',
    handler: [handleError, authorizeAzureAdToken, ensureRoleAccess, koaBody(), processFiles]
  }
]);

router.route({
  method: 'POST',
  path: '/upload-file',
  validate: {
    type: 'multipart',
    continueOnError: true,
    // @ts-ignore
    maxBody: '200MB'
  },
  handler: [
    handleError,
    koaBody({
      multipart: true,
      jsonLimit: '200mb'
    }),
    authorizeAzureAdToken,
    ensureRoleAccess,
    uploadFile
  ]
});

export default router;

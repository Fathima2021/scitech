import Router from 'koa-joi-router';
import koaBody from 'koa-body';
import { fileCheckIn, fileCheckOut } from '../controllers';
import { authorizeAzureAdToken, ensureRoleAccess, handleError } from '../middleware';

const router = Router();

/** File checkin/out routes */

router.route([
  {
    method: 'POST',
    path: '/v1/checkin',
    handler: [handleError, authorizeAzureAdToken, ensureRoleAccess, koaBody(), fileCheckIn]
  },
  {
    method: 'POST',
    path: '/v1/checkout',
    handler: [handleError, authorizeAzureAdToken, ensureRoleAccess, koaBody(), fileCheckOut]
  }
]);

export default router;

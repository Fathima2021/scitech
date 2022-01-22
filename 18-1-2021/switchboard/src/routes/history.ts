import Router from 'koa-joi-router';
import koaBody from 'koa-body';
import { fileRestore, getFileHistory, getHistorySummary } from '../controllers';
import { authorizeAzureAdToken, ensureRoleAccess, handleError } from '../middleware';

const router = Router();

/** File history routes */

router.route([
  {
    method: 'POST',
    path: '/v1/history',
    handler: [handleError, authorizeAzureAdToken, ensureRoleAccess, koaBody(), getFileHistory]
  },
  {
    method: 'POST',
    path: '/v1/history/summary',
    handler: [handleError, authorizeAzureAdToken, ensureRoleAccess, koaBody(), getHistorySummary]
  },
  {
    method: 'POST',
    path: '/v1/fileRestore',
    handler: [handleError, authorizeAzureAdToken, ensureRoleAccess, koaBody(), fileRestore]
  }
 
]);

export default router;

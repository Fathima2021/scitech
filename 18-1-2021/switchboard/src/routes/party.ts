import Router from 'koa-joi-router';
import koaBody from 'koa-body';
import { authorizeAzureAdToken, ensureRoleAccess, handleError } from '../middleware';
import { fetchParties } from '../controllers';

const router = Router();

/** File history routes */

router.route([
  {
    method: 'GET',
    path: '/v1/parties',
    handler: [handleError, koaBody(), fetchParties]
  }
]);

export default router;

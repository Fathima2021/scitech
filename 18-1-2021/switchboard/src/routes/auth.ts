import Router from 'koa-joi-router';
import koaBody from 'koa-body';
import { login, logout } from '../controllers';
import { authorizeAzureAdToken, ensureRoleAccess, handleError } from '../middleware';

const router = Router();

/** auth routes */

router.route([
  {
    method: 'GET',
    path: '/v1/login',
    handler: [handleError, authorizeAzureAdToken, koaBody(), login]
  },
  {
    method: 'GET',
    path: '/v1/logout',
    handler: [handleError, authorizeAzureAdToken, koaBody(), logout]
  }
]);

export default router;

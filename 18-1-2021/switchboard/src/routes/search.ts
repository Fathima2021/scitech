import Router from 'koa-joi-router';
import koaBody from 'koa-body';
import { getAdvancedSearch } from '../controllers';
import { authorizeAzureAdToken, ensureRoleAccess, handleError } from '../middleware';

const router = Router();

/** search routes */

router.route([
  {
    method: 'POST',
    path: '/v1/search/advanced',
    handler: [handleError, authorizeAzureAdToken, ensureRoleAccess, koaBody(), getAdvancedSearch]
  }
]);

export default router;

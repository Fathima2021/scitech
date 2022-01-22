import Router from 'koa-joi-router';
import koaBody from 'koa-body';
import { addTags, addTagItems, getTagListById } from '../controllers';
import { authorizeAzureAdToken, ensureRoleAccess, handleError } from '../middleware';

const router = Router();

/** File tags routes */

router.route([
  {
    method: 'POST',
    path: '/v1/tags/add',
    handler: [handleError, authorizeAzureAdToken, ensureRoleAccess, koaBody(), addTags]
  },
  {
    method: 'POST',
    path: '/v1/tags/items',
    handler: [handleError, authorizeAzureAdToken, ensureRoleAccess, koaBody(), addTagItems]
  },
  {
    method: 'GET',
    path: '/v1/tags',
    handler: [handleError, authorizeAzureAdToken, ensureRoleAccess, getTagListById]
  }
]);

export default router;

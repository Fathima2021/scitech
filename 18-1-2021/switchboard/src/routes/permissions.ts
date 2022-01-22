import Router from 'koa-joi-router';
import { authorizeAzureAdToken, ensureRoleAccess, handleError } from '../middleware';
import { createPermission, listPermissions, updatePermission } from '../controllers';
import { createPermissionsValidator, updatePermissionsValidator } from '../validators';

const router = Router();

router.route([
  {
    method: 'POST',
    path: '/v1/permissions/create',
    validate: {
      type: 'json',
      body: createPermissionsValidator
    },
    handler: [handleError, authorizeAzureAdToken, ensureRoleAccess, createPermission]
  }
]);

router.route([
  {
    method: 'POST',
    path: '/v1/permissions/update',
    validate: {
      type: 'json',
      body: updatePermissionsValidator
    },
    handler: [handleError, authorizeAzureAdToken, ensureRoleAccess, updatePermission]
  }
]);

router.route([
  {
    method: 'GET',
    path: '/v1/permissions',
    handler: [handleError, authorizeAzureAdToken, ensureRoleAccess, listPermissions]
  }
]);

export default router;

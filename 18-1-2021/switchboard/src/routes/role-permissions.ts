import Router from 'koa-joi-router';
import { authorizeAzureAdToken, ensureRoleAccess, handleError } from '../middleware';
import { createRolePermission, listRolePermissions, updateRolePermission } from '../controllers';
import { createRolePermissionsValidator, updateRolePermissionsValidator } from '../validators';

const router = Router();

router.route([
  {
    method: 'POST',
    path: '/v1/role-permissions/create',
    validate: {
      type: 'json',
      body: createRolePermissionsValidator
    },
    handler: [handleError, authorizeAzureAdToken, ensureRoleAccess, createRolePermission]
  }
]);

router.route([
  {
    method: 'POST',
    path: '/v1/role-permissions/update',
    validate: {
      type: 'json',
      body: updateRolePermissionsValidator
    },
    handler: [handleError, authorizeAzureAdToken, ensureRoleAccess, updateRolePermission]
  }
]);

router.route([
  {
    method: 'GET',
    path: '/v1/role-permissions',
    handler: [handleError, listRolePermissions]
  }
]);

export default router;

import Router from 'koa-joi-router';
import { authorizeAzureAdToken, ensureRoleAccess, handleError } from '../middleware';
import { createRole, listRoles, updateRole } from '../controllers';
import { createRolesValidator, updateRolesValidator } from '../validators';

const router = Router();

router.route([
  {
    method: 'POST',
    path: '/v1/roles/create',
    validate: {
      type: 'json',
      body: createRolesValidator
    },
    handler: [handleError, authorizeAzureAdToken, ensureRoleAccess, createRole]
  }
]);

router.route([
  {
    method: 'POST',
    path: '/v1/roles/update',
    validate: {
      type: 'json',
      body: updateRolesValidator
    },
    handler: [handleError, authorizeAzureAdToken, ensureRoleAccess, updateRole]
  }
]);

router.route([
  {
    method: 'GET',
    path: '/v1/roles',
    handler: [handleError, authorizeAzureAdToken, ensureRoleAccess, listRoles]
  }
]);

export default router;

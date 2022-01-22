import Router from 'koa-joi-router';
import projectsRouter from './projects';
import uploadRouter from './upload';
import historyRouter from './history';
import tagsRouter from './tags';
import checkoutRouter from './checkout';
import searchRouter from './search';
import rolesRouter from './roles';
import permissionsRouter from './permissions';
import rolePermissionsRouter from './role-permissions';
import claimsRouter from './claims';
import authRouter from './auth';
import partyRouter from './party';
import productRouter from './product';
import casesRouter from './cases';
import temp from './temp'

import { ensureRoleAccess, handleError, authorizeAzureAdToken } from '../middleware';

const router = Router();

router.route({
  handler: [
    handleError,
    (ctx) => {
      ctx.body = {
        response: 'Ok'
      };
    }
  ],
  method: 'GET',
  path: '/'
});

router.route({
  handler: [
    handleError,
    authorizeAzureAdToken,
    ensureRoleAccess,
    (ctx) => {
      ctx.body = {
        response: 'Ok',
        data: ctx.user
      };
    }
  ],
  method: 'GET',
  path: '/login-verify'
});

router.use(claimsRouter.middleware());
router.use(projectsRouter.middleware());
router.use(uploadRouter.middleware());
router.use(historyRouter.middleware());
router.use(tagsRouter.middleware());
router.use(checkoutRouter.middleware());
router.use(searchRouter.middleware());
router.use(rolesRouter.middleware());
router.use(permissionsRouter.middleware());
router.use(rolePermissionsRouter.middleware());
router.use(authRouter.middleware());
router.use(partyRouter.middleware());
router.use(productRouter.middleware());
router.use(casesRouter.middleware());
router.use(temp.middleware());

export default router;

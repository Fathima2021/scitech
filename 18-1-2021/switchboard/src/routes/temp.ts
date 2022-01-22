import Router from 'koa-joi-router';
import { activity } from '../controllers/activity'
import koaBody from 'koa-body';
import { authorizeAzureAdToken, ensureRoleAccess, handleError } from '../middleware';

const router = Router();

router.route({
    method: 'Get',
    path: '/v1/activityHistory',
    handler: [handleError, koaBody(),activity]
  });

  
export default router;
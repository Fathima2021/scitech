import Router from 'koa-joi-router';
import koaBody from 'koa-body';
import { handleError } from '../middleware';
import { fetchCase, fetchFigures } from '../controllers/cases';

const router = Router();

/** File history routes */

router.route([
  {
    method: 'GET',
    path: '/v1/cases',
    handler: [handleError, koaBody(), fetchCase]
  },
  {
    method: 'GET',
    path: '/v1/figures',
    handler: [handleError, koaBody(), fetchFigures]
  }
]);

export default router;

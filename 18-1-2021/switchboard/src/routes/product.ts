import Router from 'koa-joi-router';
import koaBody from 'koa-body';
import { handleError } from '../middleware';
import { createProductSubHeadings, fetchProducts, fetchProductSubHeadings } from '../controllers/product';

const router = Router();

/** File history routes */

router.route([
  {
    method: 'GET',
    path: '/v1/products',
    handler: [handleError, koaBody(), fetchProducts]
  },
  {
    method: 'GET',
    path: '/v1/products/subHeads',
    handler: [handleError, koaBody(), fetchProductSubHeadings]
  },
  {
    method: 'POST',
    path: '/v1/products/subHeads',
    handler: [handleError, koaBody(), createProductSubHeadings]
  }
]);

export default router;

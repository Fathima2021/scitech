import dotenv from 'dotenv';

dotenv.config();
import Koa from 'koa';
import config from 'config';
import { serviceConfig } from '@nipige/authorizer';
import logger from './utils/logger';
import routes from './routes';
import database from './database';
import models from './models/init-models';
import cors from '@koa/cors';
import serve from 'koa-static';
import mount from 'koa-mount';
import koaBody from 'koa-body';
import { authorizeAzureAdToken } from './middleware';

const app = new Koa();
/**
 * Configure database initialization
 */
database().then((value) => {
  app.context.rawDb = value;
});

/**
 * Configure base url for nipige authorizer library
 */
serviceConfig.baseURL = config.get('service_base_url');

const secureFileHandler = (path: string) => async (ctx: Koa.Context, next: any) => {
  try {
    await authorizeAzureAdToken(ctx, next);
    await serve(path)(ctx, next);
  } catch (e) {
    ctx.status = 401;
    ctx.body = {
      status: 0,
      message: e.message
    };
  }
};

app.use(cors());
// app.use(koaBody({ multipart: true, json: true }));
// app.use(mount('/patent_art_localstore', serve('./patent_art_localstore')));

/**
 * Because we're using storage mapping we mounted blob storage directly into instance,
 * this allows us to allow reliable sync and access along with secure directory mapping
 * directly making use of linux uac
 *
 * TODO: map /patent_art_{storage_type} instead of hardcoding directory path.
 */
app.use(mount('/patent_art_localstore', secureFileHandler('./patent_art_localstore')));
app.use(mount('/patent_art_azure', secureFileHandler('./patent_art_azure')));
app.use(routes.middleware());

/**
 * configure & set models in koa context
 */
app.context.db = models;

app.on('error', (error) => {
  logger.error(error, 'application error');
});

app.listen(config.get('port'), () => {
  logger.info(`server listening on port : ${config.get('port')} `);
});

import config from 'config';
import logger from './../utils/logger';
import seedDatabase from './seeder';
import { initModels } from '../models/init-models';
import { Sequelize } from 'sequelize';

export default async () => {
  try {
    const sequelize = new Sequelize(config.get('database_name'), config.get('username'), config.get('password'), {
      host: config.get('host'),
      dialect: config.get('dialect'),
      port: 1433,
      pool: {
        max: 20,
        min: 10,
        idle: 10000
      },
      dialectOptions: {
        options: { encrypt: true }
      }
    });
    sequelize
      .authenticate()
      .then((err) => {
        // init models into sequelize instance
        initModels(sequelize);
        logger.info('Database Connected');
      })
      .catch((err) => {
        console.log(err);
        logger.error('Error Connecting database');
      });
    seedDatabase();
    return sequelize;
  } catch (err) {
    logger.error('Error Connecting database');
  }
};

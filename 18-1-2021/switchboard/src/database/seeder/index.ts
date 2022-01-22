import config from 'config';
import permissions from './permissions';

const seedDatabase = (): void => {
  if (config.get('seed_database') === 'true') {
    // seed here
    // permissions().then()
  }
};

export default seedDatabase;

import logger from '../../utils/logger';
import { PermissionsSeeder } from '../../services';

enum Permission {}

enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH'
}

interface IPermission {
  action: Method;
  name: string;
  resource: string;
}

const permissions: IPermission[] = [];

export default async () => {
  const seedService = new PermissionsSeeder();
  await seedService.seedPermissions({ permissions });
  logger.info('Permission database seeded...');
};

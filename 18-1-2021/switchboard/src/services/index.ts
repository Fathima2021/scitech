/**
 * Export packages here
 */

/**
 * Usages
 * import {TestService} from './service'
 *
 *  new TestService().fetch()
 *      .then(data => console.log(data))
 *      .catch(err => console.log(err));
 *
 *
 */

export { default as PermissionsSeeder } from './seedPermission';
import ProjectService from './project';
export { ProjectService };

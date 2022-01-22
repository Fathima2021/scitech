import Service from './service';

export default class SeedService extends Service {
  public async seedPermissions(seedData: any): Promise<any> {
    const url = `/rbac/permission/seed`;
    return await this.post(url, seedData);
  }
}

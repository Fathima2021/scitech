import Service from './service';

export default class ProjectService extends Service {
  public async deleteItem(payload: any, token: any): Promise<any> {
    const url = `/v1/projects/delete`;
    this.api.defaults.headers['authorization'] = token;
    return await this.post(url, payload);
  }
}

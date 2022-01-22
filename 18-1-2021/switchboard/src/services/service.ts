import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import config from 'config';

/**
 * abstract class for service level implementation
 * example usages:
 * export default class TestService extends Service {
 *  public async fetch() {
 *    const url = `/service2/`;
 *    return await this.get(url);
 *  }
 * }
 */

export default abstract class Service {
  public api: AxiosInstance;

  constructor(data: AxiosRequestConfig = {}) {
    const conf: AxiosRequestConfig = {
      baseURL: config.get('service_base_url'),
      ...data
    };
    this.api = axios.create(conf);
  }

  public async get(url: string): Promise<any> {
    try {
      return await this.api.get(url);
    } catch (err) {
      if (err.response) throw new Error(err.response.data);
      else throw new Error(err.message);
    }
  }

  public async post(url: string, data: JSON | any): Promise<any> {
    try {
      return await this.api.post(url, data);
    } catch (err) {
      if (err.response) throw new Error(err.response.data);
      else throw new Error(err.message);
    }
  }
}

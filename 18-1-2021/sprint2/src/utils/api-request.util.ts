import { serializer } from './serialize';
import config from '../config.json';

export const URLMapper = {
  CREATE_EVIDENCE: `${config.api_url}v1/evidences/`,
  FETCH_CASES: `${config.api_url}v1/cases/`,
  FETCH_PATENTS: `${config.api_url}v1/patents/`,
  FETCH_CLAIMS: `${config.api_url}v1/claims/`,
  FETCH_PARTIES: `${config.api_url}v1/parties/`,
  FETCH_PRODUCTS: `${config.api_url}v1/products/`,
  FETCH_PRODUCTS_HEAD: `${config.api_url}v1/products/subHeads/`,
  FETCH_CLAIM_ELEMENTS: `${config.api_url}v1/claims/elements`,
  FETCH_EVIDENCES: `${config.api_url}v1/evidences/`,
  FETCH_FIGURES: `${config.api_url}v1/figures/`,
  CREATE_PRODUCTS_HEAD: `${config.api_url}v1/products/subHeads/`,
  DELETE_INFRINGMENTS: `${config.api_url}v1/infringements/`,
};

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const apiCall = (url: string, data = {}, method = 'GET', headers = 'application/json'): any => {
  let _url = url;
  let options: any = {
    method: method,
    headers: {
      'Content-Type': headers,
    },
  };
  if (method === 'GET') {
    _url = url + '?' + serializer(data);
  } else if (method === 'POST' || method === 'PUT') {
    if (headers === 'multipart/form-data') {
      options = {
        method: method,
        body: data,
      };
    } else {
      options = {
        ...options,
        method: method,
        body: JSON.stringify(data),
      };
    }
  }
  return fetch(_url, options)
    .then((_res) => _res.json())
    .then((data) => data);
};

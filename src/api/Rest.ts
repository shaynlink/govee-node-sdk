'use strict';

import * as axios from 'axios';
import type {AxiosInstance} from 'axios';
import type Client from '../client/Client';
import {version} from '../../package.json';

const NODE_ENV = process.env.NODE_ENV ?? 'unknown';

/**
 * Rest class for communicate with GOVEE Api
 */
export default class Rest {
  public instance: AxiosInstance;
  /**
   * @param {Client} client - govee-node-sdk Client
   */
  constructor(client: Client) {
    this.instance = (<any>axios).create({
      baseURL: 'https://developer-api.govee.com/v1/',
      headers: {
        'Govee-API-Key': client.goveeApiKey,
        'Content-Type': 'application/json',
        'User-Agent': `goove-node-sdk/${version} (env: ${NODE_ENV}}`,
      },
      timeout: 1000,
    });

    this.instance.interceptors.request.use(async function(config) {
      console.log('before');
      await new Promise((resolve) => setTimeout(resolve, 5000));
      console.log('after');
      console.log(config);
      return config;
    }, function(error) {
      return Promise.reject(error);
    });
  }
}

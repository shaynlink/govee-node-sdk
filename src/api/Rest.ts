'use strict';

import * as axios from 'axios';
import type {
  AxiosInstance,
  AxiosRequestConfig,
} from 'axios';
import type Client from '../client/Client';
import Clock from './Clock';
import {axiosInstance} from './axios-instance';

/**
 * Rest class for communicate with GOVEE Api
 */
export default class Rest extends Clock {
  public instance: AxiosInstance;

  /**
   * @param {Client} client - govee-node-sdk Client
   */
  constructor(client: Client) {
    super();

    this.instance = axiosInstance;
    // default not create on UT
    if ('defaults' in this.instance) {
      this.instance
          .defaults.headers.common['Govee-API-Key'] = client.goveeApiKey;
    }

    // Interceptors not created on UT
    this.instance.interceptors?.response.use((response) => {
      const headers = response.headers;
      const url = response.request.path;
      const model = response.data?.model ?? '';
      const device = response.data?.device ?? '';
      const hash = url.split('/v1').pop() + model + device;

      const traceId = headers['x-traceid'];

      client.emit('trace', response);
      client.emit('debug', `[${
        traceId
      }] API response time ${headers['x-response-time']}`);

      const rtLimit = headers['x-ratelimit-limit'] ?
      parseInt(headers['x-ratelimit-limit']) :
        undefined;
      const rtRemaining = headers['x-ratelimit-remaining'] ?
        parseInt(headers['x-ratelimit-remaining']) :
        undefined;
      const rtReset = headers['x-ratelimit-reset'] ?
        parseInt(headers['x-ratelimit-reset']) :
        undefined;
      const rtResetTimer = (rtReset ?
        (rtReset * 1000) - Date.now() :
        1000*60*60*24) + 1000*60*5;

      client.emit(
          'debug',
          `[${traceId}] Global ratelimit ${
            rtRemaining
          }/${
            rtLimit
          } reset on ${rtResetTimer} ms`,
      );

      if (rtRemaining == 0 && !this.hasDirectiveFromHash(hash)) {
        this.pushDirective<'STOP'>('STOP', {
          timeout: rtResetTimer,
          hash,
        });
        client.emit('debug', `[${traceId}] rate limit reach for ${
          hash
        }, request will be handled in ${
          rtResetTimer
        } ms`);
      }

      const apiRtLimit = headers['api-ratelimit-limit'] ?
        parseInt(headers['api-ratelimit-limit']) :
          undefined;
      const apiRtRemaining = headers['api-ratelimit-remaining'] ?
          parseInt(headers['api-ratelimit-remaining']) :
          undefined;
      const apiRtReset = headers['api-ratelimit-reset'] ?
          parseInt(headers['api-ratelimit-reset']) :
          undefined;
      const apiRtResetTimer = (apiRtReset ?
        (apiRtReset * 1000) - Date.now() :
        1000*60) + 1000*30;

      client.emit(
          'debug',
          `[${traceId}] API ratelimit ${
            apiRtRemaining
          }/${
            apiRtLimit
          } reset on ${apiRtResetTimer} ms`,
      );

      if (apiRtRemaining == 0 && !this.hasDirectiveFromHash(hash)) {
        this.pushDirective<'STOP'>('STOP', {
          timeout: apiRtResetTimer,
          hash,
        });

        client.emit('debug', `[${traceId}] rate limit reach for ${
          hash
        }, request will be handled in ${apiRtResetTimer} ms`);
      }


      return response;
    }, function(error) {
      return Promise.reject(error);
    });
  }

  /**
   * @param {string} url
   * @param {AxiosRequestConfig<any>} config
   * @return {Promise<axios.AxiosResponse<any, any>>}
   */
  get(url: string, config: AxiosRequestConfig<any>):
    Promise<axios.AxiosResponse<any, any>> {
    return new Promise((resolve) => {
      this.push(async () => {
        resolve(await this.instance.get(url, config));
      }, url);
    });
  }

  /**
   * @param {string} url
   * @param {any} data
   * @param {AxiosRequestConfig<any>} config
   * @return {Promise<axios.AxiosResponse<any, any>>}
   */
  put(
      url: string,
      data: any | undefined,
      config: AxiosRequestConfig<any> | undefined,
  ): Promise<axios.AxiosResponse<any, any>> {
    return new Promise((resolve) => {
      const model = data?.model ?? '';
      const device = data?.device ?? '';

      this.push(async () => {
        resolve(await this.instance.put(url, data, config));
      }, url + model + device);
    });
  }
}

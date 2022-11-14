'use strict';

import * as axios from 'axios';
import type {AxiosInstance} from 'axios';
import {version} from '../../package.json';

const NODE_ENV = process.env.NODE_ENV ?? 'unknown';

export const axiosInstance: AxiosInstance = (<any>axios).create({
  baseURL: 'https://developer-api.govee.com/v1/',
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': `goove-node-sdk/${version} (env: ${NODE_ENV})`,
  },
  timeout: 1000,
});

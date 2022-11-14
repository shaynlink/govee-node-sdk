'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const axios = require("axios");
const Clock_1 = require("./Clock");
const package_json_1 = require("../../package.json");
const NODE_ENV = process.env.NODE_ENV ?? 'unknown';
/**
 * Rest class for communicate with GOVEE Api
 */
class Rest extends Clock_1.default {
    /**
     * @param {Client} client - govee-node-sdk Client
     */
    constructor(client) {
        super();
        this.instance = axios.create({
            baseURL: 'https://developer-api.govee.com/v1/',
            headers: {
                'Govee-API-Key': client.goveeApiKey,
                'Content-Type': 'application/json',
                'User-Agent': `goove-node-sdk/${package_json_1.version} (env: ${NODE_ENV}}`,
            },
            timeout: 10000,
        });
        this.instance.interceptors.response.use((response) => {
            const headers = response.headers;
            const url = response.request.path;
            const model = response.data?.model ?? '';
            const device = response.data?.device ?? '';
            const hash = url.split('/v1').pop() + model + device;
            const traceId = headers['x-traceid'];
            client.emit('trace', response);
            client.emit('debug', `[${traceId}] API response time ${headers['x-response-time']}`);
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
                1000 * 60 * 60 * 24) + 1000 * 60 * 5;
            client.emit('debug', `[${traceId}] Global ratelimit ${rtRemaining}/${rtLimit} reset on ${rtResetTimer} ms`);
            if (rtRemaining == 0 && !this.hasDirectiveFromHash(hash)) {
                this.pushDirective('STOP', {
                    timeout: rtResetTimer,
                    hash,
                });
                client.emit('debug', `[${traceId}] rate limit reach for ${hash}, request will be handled in ${rtResetTimer} ms`);
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
                1000 * 60) + 1000 * 30;
            client.emit('debug', `[${traceId}] API ratelimit ${apiRtRemaining}/${apiRtLimit} reset on ${apiRtResetTimer} ms`);
            if (apiRtRemaining == 0 && !this.hasDirectiveFromHash(hash)) {
                this.pushDirective('STOP', {
                    timeout: apiRtResetTimer,
                    hash,
                });
                client.emit('debug', `[${traceId}] rate limit reach for ${hash}, request will be handled in ${apiRtResetTimer} ms`);
            }
            return response;
        }, function (error) {
            console.error(error.response.data);
            return Promise.reject(new Error('error'));
        });
    }
    /**
     * @param {string} url
     * @param {AxiosRequestConfig<any>} config
     * @return {Promise<axios.AxiosResponse<any, any>>}
     */
    get(url, config) {
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
    put(url, data, config) {
        return new Promise((resolve) => {
            const model = data?.model ?? '';
            const device = data?.device ?? '';
            this.push(async () => {
                resolve(await this.instance.put(url, data, config));
            }, url + model + device);
        });
    }
}
exports.default = Rest;
//# sourceMappingURL=Rest.js.map
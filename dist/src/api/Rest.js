'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const axios = require("axios");
const package_json_1 = require("../../package.json");
const NODE_ENV = process.env.NODE_ENV ?? 'unknown';
/**
 * Rest class for communicate with GOVEE Api
 */
class Rest {
    /**
     * @param {Client} client - govee-node-sdk Client
     */
    constructor(client) {
        this.instance = axios.create({
            baseURL: 'https://developer-api.govee.com/v1/',
            headers: {
                'Govee-API-Key': client.goveeApiKey,
                'Content-Type': 'application/json',
                'User-Agent': `goove-node-sdk/${package_json_1.version} (env: ${NODE_ENV}}`,
            },
            timeout: 1000,
        });
        this.instance.interceptors.request.use(async function (config) {
            console.log('before');
            await new Promise((resolve) => setTimeout(resolve, 5000));
            console.log('after');
            console.log(config);
            return config;
        }, function (error) {
            return Promise.reject(error);
        });
    }
}
exports.default = Rest;
//# sourceMappingURL=Rest.js.map
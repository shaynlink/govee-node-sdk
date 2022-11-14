import * as axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import type Client from '../client/Client';
import Clock from './Clock';
/**
 * Rest class for communicate with GOVEE Api
 */
export default class Rest extends Clock {
    instance: AxiosInstance;
    /**
     * @param {Client} client - govee-node-sdk Client
     */
    constructor(client: Client);
    /**
     * @param {string} url
     * @param {AxiosRequestConfig<any>} config
     * @return {Promise<axios.AxiosResponse<any, any>>}
     */
    get(url: string, config: AxiosRequestConfig<any>): Promise<axios.AxiosResponse<any, any>>;
    /**
     * @param {string} url
     * @param {any} data
     * @param {AxiosRequestConfig<any>} config
     * @return {Promise<axios.AxiosResponse<any, any>>}
     */
    put(url: string, data: any | undefined, config: AxiosRequestConfig<any> | undefined): Promise<axios.AxiosResponse<any, any>>;
}
//# sourceMappingURL=Rest.d.ts.map
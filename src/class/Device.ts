'use strict';

import type {
  CmdValue,
  DeviceProperties,
  DeviceResponseData,
  RGB,
  SupportCmd,
  GoveeResponseData,
  DeviceStateResponseData,
} from '../api-definition';
import type Client from '../client/Client';
import type {AxiosResponse} from 'axios';
import BaseDevice from './BaseDevice';

/**
 * Device class
 */
export default class Device extends BaseDevice {
  public client: Client;
  public supportCmds: SupportCmd[];
  public properties?: DeviceProperties;
  /**
   * @param {Client} client - Client
   * @param {DeviceResponseData} data - data from Api
   */
  constructor(client: Client, data: DeviceResponseData) {
    super(data);
    this.client = client;
    this.supportCmds = data.supportCmds;
    this.properties = data.properties;

    this._data.supportCmds = data.supportCmds;
    this._data.properties = data.properties;
  }

  /**
   * @param {SupportCmd} cmdName - device command
   * @param {CmdValue} cmdValue - device command value
   * @return {Promise<boolean>}
   */
  public control(cmdName: SupportCmd, cmdValue: CmdValue): Promise<boolean> {
    if (!this.supportCmds.includes(cmdName)) {
      throw Error(`Command ${cmdName} is not supported`);
    }

    if (cmdName == 'turn' && !['on', 'off'].includes(cmdValue as string)) {
      throw Error(`Value of ${cmdName} is not correct ${cmdValue}`);
    }

    if (cmdName == 'brightness' && (
      cmdValue as number < 0 || cmdValue as number > 100
    )) {
      throw Error(`Value of ${cmdName} is not correct ${cmdValue}`);
    }

    if (cmdName == 'color' && (
      ((<RGB>cmdValue).r < 0 || (<RGB>cmdValue).r > 255) ||
      ((<RGB>cmdValue).g < 0 || (<RGB>cmdValue).g > 255) ||
      ((<RGB>cmdValue).b < 0 || (<RGB>cmdValue).b > 255)
    )) {
      throw Error(`Value of ${cmdName} is not correct ${cmdValue}`);
    }

    if (cmdName == 'colorTerm' && !!this.properties && (
      cmdValue as number < this.properties?.colorTem.range.min ||
      cmdValue as number > this.properties?.colorTem.range.max
    )) {
      throw Error(`Value of ${cmdName} is not correct ${cmdValue}`);
    }

    return this.client.rest.put('/devices/control', {
      device: this.device,
      model: this.model,
      cmd: {
        name: cmdName,
        value: cmdValue,
      },
    }, {
      validateStatus(status: number): boolean {
        return status == 200;
      },
    })
        .then((response: AxiosResponse<
          GoveeResponseData<{}>
        >) => {
          return response.data.code == 200;
        });
  }

  /**
   * @return {DeviceStateResponseData}
   */
  public state(): Promise<DeviceStateResponseData> {
    return this.client.rest.get('/devices/state', {
      params: {
        device: this.device,
        model: this.model,
      },
      validateStatus(status: number): boolean {
        return status == 200;
      },
    })
        .then((response: AxiosResponse<
          GoveeResponseData<DeviceStateResponseData>
        >) => {
          return response.data.data;
        });
  }
}

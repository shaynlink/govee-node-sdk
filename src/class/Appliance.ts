'use strict';

import {AxiosResponse} from 'axios';
import type {
  ApplianceDeviceProperties,
  ApplianceDeviceResponseData,
  SupportApplianceCmd,
  ApplianceCmdValue,
  GoveeResponseData,
} from '../api-definition';
import type Client from '../client/Client';
import BaseDevice from './BaseDevice';

/**
 * Appliance class
 */
export default class Appliance extends BaseDevice {
  public client: Client;
  public supportCmds: SupportApplianceCmd[];
  public properties?: ApplianceDeviceProperties;
  /**
   * @param {Client} client - Client
   * @param {ApplianceDeviceResponseData} data - data from Api
   */
  constructor(client: Client, data: ApplianceDeviceResponseData) {
    super(data);
    this.client = client;
    this.supportCmds = data.supportCmds;
    this.properties = data.properties;

    this._data.supportCmds = data.supportCmds;
    this._data.properties = data.properties;
  }

  /**
   * @param {SupportApplianceCmd} cmdName - device command
   * @param {ApplianceCmdValue} cmdValue - device command value
   * @return {Promise<boolean>}
   */
  public control(cmdName: SupportApplianceCmd, cmdValue: ApplianceCmdValue):
    Promise<boolean> {
    if (!this.supportCmds.includes(cmdName)) {
      throw Error(`Command ${cmdName} in not supported`);
    }

    if (cmdName == 'turn' && !['on', 'off'].includes(cmdValue as string)) {
      throw Error(`Value of ${cmdName} is not correct ${cmdValue}`);
    }

    if (cmdName == 'mode' && (
      !this.properties?.mode.options.some((opt) => opt.value == cmdValue)
    )) {
      throw Error(`Value of ${cmdName} is not include ${cmdValue}`);
    }

    return this.client.rest.put('/appliance/devices/control', {
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
}

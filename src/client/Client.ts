'use strict';

import Rest from '../api/Rest';
import type {AxiosResponse} from 'axios';
import type {
  GoveeResponseData,
  DeviceListResponseData,
  DeviceResponseData,
  ApplianceDeviceResponseData,
} from '../api-definition';
import Device from '../class/Device';
import Appliance from '../class/Appliance';

/**
 * Client
 */
export default class Client {
  public goveeApiKey: string;
  public rest: Rest;
  public devices: Map<string, Device>;
  public appliances: Map<string, Appliance>;
  /**
   * @param {string} goveeApiKey
   */
  constructor(goveeApiKey: string) {
    this.goveeApiKey = goveeApiKey;

    if (!this.goveeApiKey && ('GOVEE_API_KEY' in process.env)) {
      this.goveeApiKey = process.env.GOVEE_API_KEY as string;
    }

    this.rest = new Rest(this);

    this.devices = new Map();
    this.appliances = new Map();
  }
  /**
   * Get information about all supported devices in the account
   * @return {Promise<Map<string, Device>>}
   */
  public deviceList(): Promise<Map<string, Device>> {
    return this.rest.instance.get('/devices', {
      validateStatus(status: number) {
        return status == 200;
      },
    })
        .then((response: AxiosResponse<
          GoveeResponseData<DeviceListResponseData<DeviceResponseData[]>>
        >) => {
          response.data.data.devices
              .forEach((deviceData: DeviceResponseData) => {
                const device = new Device(this, deviceData);
                this.devices.set(device.device, device);
              });
          return this.devices;
        });
  }
  /**
   * Get information about all supported appliances devices in the account
   * @return {Promise<Map<string, Appliance>>}
   */
  public applianceList(): Promise<Map<string, Appliance>> {
    return this.rest.instance.get('/appliance/devices', {
      validateStatus(status: number) {
        return status == 200;
      },
    })
        .then((response: AxiosResponse<
          GoveeResponseData<
            DeviceListResponseData<ApplianceDeviceResponseData[]>
          >
        >) => {
          response.data.data.devices
              .forEach((deviceData: ApplianceDeviceResponseData) => {
                const device = new Appliance(this, deviceData);
                this.appliances.set(device.device, device);
              });
          return this.appliances;
        });
  }
};

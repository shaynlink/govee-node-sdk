'use strict';

import {
  DeviceResponseDataDefault,
} from '../api-definition';

/**
 * Regroup commun data
 */
export default class BaseDevice {
  public model: string;
  public device: string;
  public deviceName?: string;
  public controllable: boolean;
  public retrievable: boolean;
  public _data: any;
  /**
   * @param {DeviceResponseDataDefault} data
   */
  constructor(data: DeviceResponseDataDefault) {
    this.model = data.model;
    this.device = data.device;
    this.deviceName = data.deviceName;
    this.controllable = data.controllable;
    this.retrievable = data.retrievable;
    this._data = data;
  }

  /**
   * Return data
   * @return {any}
   */
  toJSON() {
    return this._data;
  }
}

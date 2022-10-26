export interface GoveeResponseData<D> {
  code: number;
  message: string;
  data: D;
}
export interface DeviceListResponseData<D> {
  devices: D;
}
export type SupportCmd = 'turn' | 'brightness' | 'color' | 'colorTerm';
export interface RGB {
  r: number;
  g: number;
  b: number;
}
export type CmdValue = 'on' | 'off' | number | RGB;

export interface DeviceResponseDataDefault {
  model: string;
  device: string;
  deviceName?: string;
  controllable: boolean;
  retrievable: boolean;
}

export interface DeviceResponseData extends DeviceResponseDataDefault {
  supportCmds: SupportCmd[];
  properties?: DeviceProperties;
}
export interface DeviceProperties {
  colorTem: {
    range: {
      min: number;
      max: number;
    }
  }
}
export interface DeviceStateResponseData {
  model: string;
  device: string;
  name: string;
  properties: DeviceStateProperties[];
}
export type DeviceStateProperties =
  { online: boolean } |
  { powerState: 'on' | 'off' } |
  { brightness: number } |
  { color: RGB } |
  { colorTem: number }
export type SupportApplianceCmd = 'turn' | 'mode'
export interface ApplianceDeviceProperties {
  mode: {
    options: {name: SupportApplianceCmd; value: number}[]
  }
}
export interface ApplianceDeviceResponseData extends DeviceResponseDataDefault {
  supportCmds: SupportApplianceCmd[];
  properties: ApplianceDeviceProperties;
}
export type ApplianceCmdValue = 'on' | 'off' | number;

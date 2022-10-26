import type { CmdValue, DeviceProperties, DeviceResponseData, SupportCmd, DeviceStateResponseData } from '../api-definition';
import type Client from '../client/Client';
import BaseDevice from './BaseDevice';
/**
 * Device class
 */
export default class Device extends BaseDevice {
    client: Client;
    supportCmds: SupportCmd[];
    properties?: DeviceProperties;
    /**
     * @param {Client} client - Client
     * @param {DeviceResponseData} data - data from Api
     */
    constructor(client: Client, data: DeviceResponseData);
    /**
     * @param {SupportCmd} cmdName - device command
     * @param {CmdValue} cmdValue - device command value
     * @return {Promise<boolean>}
     */
    control(cmdName: SupportCmd, cmdValue: CmdValue): Promise<boolean>;
    /**
     * @return {DeviceStateResponseData}
     */
    state(): Promise<DeviceStateResponseData>;
}
//# sourceMappingURL=Device.d.ts.map
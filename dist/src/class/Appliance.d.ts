import type { ApplianceDeviceProperties, ApplianceDeviceResponseData, SupportApplianceCmd, ApplianceCmdValue } from '../api-definition';
import type Client from '../client/Client';
import BaseDevice from './BaseDevice';
/**
 * Appliance class
 */
export default class Appliance extends BaseDevice {
    client: Client;
    supportCmds: SupportApplianceCmd[];
    properties?: ApplianceDeviceProperties;
    /**
     * @param {Client} client - Client
     * @param {ApplianceDeviceResponseData} data - data from Api
     */
    constructor(client: Client, data: ApplianceDeviceResponseData);
    /**
     * @param {SupportApplianceCmd} cmdName - device command
     * @param {ApplianceCmdValue} cmdValue - device command value
     * @return {Promise<boolean>}
     */
    control(cmdName: SupportApplianceCmd, cmdValue: ApplianceCmdValue): Promise<boolean>;
}
//# sourceMappingURL=Appliance.d.ts.map
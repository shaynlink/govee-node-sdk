import Rest from '../api/Rest';
import Device from '../class/Device';
import Appliance from '../class/Appliance';
/**
 * Client
 */
export default class Client {
    goveeApiKey: string;
    rest: Rest;
    devices: Map<string, Device>;
    appliances: Map<string, Appliance>;
    /**
     * @param {string} goveeApiKey
     */
    constructor(goveeApiKey: string);
    /**
     * Get information about all supported devices in the account
     * @return {Promise<Map<string, Device>>}
     */
    deviceList(): Promise<Map<string, Device>>;
    /**
     * Get information about all supported appliances devices in the account
     * @return {Promise<Map<string, Appliance>>}
     */
    applianceList(): Promise<Map<string, Appliance>>;
}
//# sourceMappingURL=Client.d.ts.map
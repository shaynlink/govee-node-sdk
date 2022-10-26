'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const BaseDevice_1 = require("./BaseDevice");
/**
 * Appliance class
 */
class Appliance extends BaseDevice_1.default {
    /**
     * @param {Client} client - Client
     * @param {ApplianceDeviceResponseData} data - data from Api
     */
    constructor(client, data) {
        super(data);
        this.client = client;
        this.supportCmds = data.supportCmds;
        this.properties = data.properties;
    }
    /**
     * @param {SupportApplianceCmd} cmdName - device command
     * @param {ApplianceCmdValue} cmdValue - device command value
     * @return {Promise<boolean>}
     */
    control(cmdName, cmdValue) {
        if (!this.supportCmds.includes(cmdName)) {
            throw Error(`Command ${cmdName} in not supported`);
        }
        if (cmdName == 'turn' && !['on', 'off'].includes(cmdValue)) {
            throw Error(`Value of ${cmdName} is not correct ${cmdValue}`);
        }
        if (cmdName == 'mode' && (!this.properties?.mode.options.some((opt) => opt.value == cmdValue))) {
            throw Error(`Value of ${cmdName} is not include ${cmdValue}`);
        }
        return this.client.rest.instance.put('/appliance/devices/control', {
            device: this.device,
            model: this.model,
            cmd: {
                name: cmdName,
                value: cmdValue,
            },
        }, {
            validateStatus(status) {
                return status == 200;
            },
        })
            .then((response) => {
            return response.data.code == 200;
        });
    }
}
exports.default = Appliance;
//# sourceMappingURL=Appliance.js.map
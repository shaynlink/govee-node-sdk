'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const BaseDevice_1 = require("./BaseDevice");
/**
 * Device class
 */
class Device extends BaseDevice_1.default {
    /**
     * @param {Client} client - Client
     * @param {DeviceResponseData} data - data from Api
     */
    constructor(client, data) {
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
    control(cmdName, cmdValue) {
        if (!this.supportCmds.includes(cmdName)) {
            throw Error(`Command ${cmdName} is not supported`);
        }
        if (cmdName == 'turn' && !['on', 'off'].includes(cmdValue)) {
            throw Error(`Value of ${cmdName} is not correct ${cmdValue}`);
        }
        if (cmdName == 'brightness' && (cmdValue < 0 || cmdValue > 100)) {
            throw Error(`Value of ${cmdName} is not correct ${cmdValue}`);
        }
        if (cmdName == 'color' && ((cmdValue.r < 0 || cmdValue.r > 255) ||
            (cmdValue.g < 0 || cmdValue.g > 255) ||
            (cmdValue.b < 0 || cmdValue.b > 255))) {
            throw Error(`Value of ${cmdName} is not correct ${cmdValue}`);
        }
        if (cmdName == 'colorTerm' && !!this.properties && (cmdValue < this.properties?.colorTem.range.min ||
            cmdValue > this.properties?.colorTem.range.max)) {
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
            validateStatus(status) {
                return status == 200;
            },
        })
            .then((response) => {
            return response.data.code == 200;
        });
    }
    /**
     * @return {DeviceStateResponseData}
     */
    state() {
        return this.client.rest.get('/devices/state', {
            params: {
                device: this.device,
                model: this.model,
            },
            validateStatus(status) {
                return status == 200;
            },
        })
            .then((response) => {
            return response.data.data;
        });
    }
}
exports.default = Device;
//# sourceMappingURL=Device.js.map
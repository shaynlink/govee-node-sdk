'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const Rest_1 = require("../api/Rest");
const Device_1 = require("../class/Device");
const Appliance_1 = require("../class/Appliance");
const node_events_1 = require("node:events");
/**
 * Client
 */
class Client extends node_events_1.EventEmitter {
    /**
     * @param {string} goveeApiKey
     */
    constructor(goveeApiKey) {
        super();
        this.goveeApiKey = goveeApiKey;
        if (!this.goveeApiKey && ('GOVEE_API_KEY' in process.env)) {
            this.goveeApiKey = process.env.GOVEE_API_KEY;
        }
        this.rest = new Rest_1.default(this);
        this.devices = new Map();
        this.appliances = new Map();
    }
    /**
     * Get information about all supported devices in the account
     * @return {Promise<Map<string, Device>>}
     */
    deviceList() {
        return this.rest.get('/devices', {
            validateStatus(status) {
                return status == 200;
            },
        })
            .then((response) => {
            response.data.data.devices
                .forEach((deviceData) => {
                const device = new Device_1.default(this, deviceData);
                this.devices.set(device.device, device);
            });
            return this.devices;
        });
    }
    /**
     * Get information about all supported appliances devices in the account
     * @return {Promise<Map<string, Appliance>>}
     */
    applianceList() {
        return this.rest.get('/appliance/devices', {
            validateStatus(status) {
                return status == 200;
            },
        })
            .then((response) => {
            response.data.data.devices
                .forEach((deviceData) => {
                const device = new Appliance_1.default(this, deviceData);
                this.appliances.set(device.device, device);
            });
            return this.appliances;
        });
    }
    /**
     * Uncork / Unref function
     * @return {this}
     */
    close() {
        this.rest.destroy();
        return this;
    }
}
exports.default = Client;
;
//# sourceMappingURL=Client.js.map
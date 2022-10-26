'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const Rest_1 = require("../api/Rest");
const Device_1 = require("../class/Device");
const Appliance_1 = require("../class/Appliance");
/**
 * Client
 */
class Client {
    /**
     * @param {string} goveeApiKey
     */
    constructor(goveeApiKey) {
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
        return this.rest.instance.get('/devices', {
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
        return this.rest.instance.get('/appliance/devices', {
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
}
exports.default = Client;
;
//# sourceMappingURL=Client.js.map
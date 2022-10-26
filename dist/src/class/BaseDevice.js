'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Regroup commun data
 */
class BaseDevice {
    /**
     * @param {DeviceResponseDataDefault} data
     */
    constructor(data) {
        this.model = data.model;
        this.device = data.device;
        this.deviceName = data.deviceName;
        this.controllable = data.controllable;
        this.retrievable = data.retrievable;
    }
}
exports.default = BaseDevice;
//# sourceMappingURL=BaseDevice.js.map
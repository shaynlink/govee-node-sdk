import { DeviceResponseDataDefault } from '../api-definition';
/**
 * Regroup commun data
 */
export default class BaseDevice {
    model: string;
    device: string;
    deviceName?: string;
    controllable: boolean;
    retrievable: boolean;
    _data: any;
    /**
     * @param {DeviceResponseDataDefault} data
     */
    constructor(data: DeviceResponseDataDefault);
}
//# sourceMappingURL=BaseDevice.d.ts.map
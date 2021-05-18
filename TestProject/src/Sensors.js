/* eslint-disable prettier/prettier */
export {default as GenericTimeframe} from './sensors/GenericTimeframe';
export {default as Accelerometer} from './sensors/Accelerometer';
export {default as AccelerometerSample} from './sensors/AccelerometerSample';
export {default as Mic} from './sensors/Mic';
export const SensorType = {
    ACCELEROMETER: 0,
    GYROSCOPE: 1,
    MICROPHONE: 2,
};

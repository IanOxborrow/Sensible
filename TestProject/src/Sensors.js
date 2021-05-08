/* eslint-disable prettier/prettier */
export {default as GenericTimeframe} from './sensors/GenericTimeframe';
export {default as Accelerometer} from './sensors/Accelerometer';
export {default as AccelerometerSample} from './sensors/AccelerometerSample';
export {default as Gyroscope} from './sensors/Gyroscope';
export {default as GyroscopeSample} from './sensors/GyroscopeSample';
export {default as Barometer} from './sensors/Barometer';
export {default as BarometerSample} from './sensors/BarometerSample';
export {default as Magnetometer} from './sensors/Magnetometer';
export {default as MagnetometerSample} from './sensors/MagnetometerSample';
export {default as Mic} from './sensors/Mic';
export const SensorType = {
    ACCELEROMETER: 0,
    GYROSCOPE: 1,
    MAGNETOMETER: 2,
    BAROMETER: 3,
    MICROPHONE: 4,
};

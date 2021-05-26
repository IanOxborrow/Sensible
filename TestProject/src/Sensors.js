/* eslint-disable prettier/prettier */
import Accelerometer from './sensors/Accelerometer';
import Gyroscope from './sensors/Gyroscope';
import Magnetometer from './sensors/Magnetometer';
import Barometer from './sensors/Barometer';
import Mic from './sensors/Mic';

export { default as GenericTimeframe } from "./sensors/GenericTimeframe";
export { default as Accelerometer } from "./sensors/Accelerometer";
export { default as AccelerometerSample } from "./sensors/AccelerometerSample";
export { default as Gyroscope } from "./sensors/Gyroscope";
export { default as GyroscopeSample } from "./sensors/GyroscopeSample";
export { default as Barometer } from "./sensors/Barometer";
export { default as BarometerSample } from "./sensors/BarometerSample";
export { default as Magnetometer } from "./sensors/Magnetometer";
export { default as MagnetometerSample } from "./sensors/MagnetometerSample";
export { default as Mic } from "./sensors/Mic";
export const SensorType = {
    ACCELEROMETER: 0,
    GYROSCOPE: 1,
    MAGNETOMETER: 2,
    BAROMETER: 3,
    MICROPHONE: 4,
};
export const getSensorClass = (type) => {
    switch (type)
    {
        case SensorType.ACCELEROMETER:
            return Accelerometer;
        case SensorType.GYROSCOPE:
            return Gyroscope;
        case SensorType.MAGNETOMETER:
            return Magnetometer;
        case SensorType.BAROMETER:
            return Barometer;
        case SensorType.MICROPHONE:
            return Mic;
        default:
            throw new Error("Sensors.getSensorClass: Received an unknown type");
    }
};

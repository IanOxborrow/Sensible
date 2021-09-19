/* eslint-disable prettier/prettier */
import Accelerometer from './sensors/Accelerometer';
import Gyroscope from './sensors/Gyroscope';
import Magnetometer from './sensors/Magnetometer';
import Barometer from './sensors/Barometer';
import Mic from './sensors/Mic';
import GPS from './sensors/GPS';
import BackCameraRecorder from "./sensors/BackCameraRecorder";
import MicrophoneRecorder from "./sensors/MicrophoneRecorder";

export {default as GenericTimeframe} from './sensors/GenericTimeframe';
export {default as Accelerometer} from './sensors/Accelerometer';
export {default as AccelerometerSample} from './sensors/AccelerometerSample';
export {default as Gyroscope} from './sensors/Gyroscope';
export {default as GyroscopeSample} from './sensors/GyroscopeSample';
export {default as Barometer} from './sensors/Barometer';
export {default as BarometerSample} from './sensors/BarometerSample';
export {default as Magnetometer} from './sensors/Magnetometer';
export {default as MagnetometerSample} from './sensors/MagnetometerSample';
export {default as MicrophoneRecorder} from './sensors/MicrophoneRecorder';
export {default as BackCameraRecorder} from './sensors/BackCameraRecorder';
export {default as GPS} from './sensors/GPS';
export {default as GPSSample} from './sensors/GPSSample';

export const HardwareType = {
    SENSOR: 1,
    RECORDER: 3
}

export const SensorType = {
    ACCELEROMETER: 1,
    GYROSCOPE: 3,
    MAGNETOMETER: 5,
    BAROMETER: 7,
    MICROPHONE: 9,
    GPS: 10,
    BACK_CAMERA: 12,
};

/**
 * Created by Chathura Galappaththi
 * Stores all necessary information about the sensors in one place
 */
export const SensorInfo = {
    [SensorType.ACCELEROMETER]: {
        name: "Accelerometer",
        type: HardwareType.SENSOR,
        imageSrc: require('./assets/accelerometer_icon.png'),
        class: Accelerometer,
        measure: "Acceleration",
        units: "m/s^2",
        description: {
            measure: "Rate of change of velocity (how fast you move the phone)",
            output: "x per sample rate, representing current velocity (m/s^2)"
        }
    },
    [SensorType.GYROSCOPE]: {
        name: "Gyroscope",
        type: HardwareType.SENSOR,
        imageSrc: require('./assets/gyroscope_icon.png'),
        class: Gyroscope,
        measure: "Angular velocity",
        units: "RPS",
        description: {
            measure: "Orientation and angular velocity (rate of change of movement in each axis)",
            output: "x, y, z per sample rate, representing each vector's change in velocity (m/s^2)"
        }
    },
    [SensorType.MAGNETOMETER]: {
        name: "Magnetometer",
        type: HardwareType.SENSOR,
        imageSrc: require('./assets/magnetometer_icon.png'), // TODO: Update icon!
        class: Magnetometer,
        measure: "Magnetic Field Direction",
        units: "μT",
        // TODO: Update description!
        description: {
            measure: "ADD MEASURE HERE",
            output: "ADD OUTPUT HERE"
        }
    },
    [SensorType.BAROMETER]: {
        name: "Barometer",
        type: HardwareType.SENSOR,
        imageSrc: require('./assets/barometer_icon.png'), // TODO: Update icon!
        class: Barometer,
        measure: "Atmospheric Pressure",
        units: "psi",
        // TODO: Update description!
        description: {
            measure: "ADD MEASURE HERE",
            output: "ADD OUTPUT HERE"
        }
    },
    [SensorType.MICROPHONE]: {
        name: "Microphone",
        type: HardwareType.RECORDER,
        imageSrc: require('./assets/microphone_icon.png'),
        class: MicrophoneRecorder,
        measure: "Amplitude",
        units: "dB",
        description: {
            measure: "Sound, amplitude representing decibels",
            output: "MP3 file, saved to device"
        }
    },
    [SensorType.GPS]: {
        name: "GPS",
        type: HardwareType.SENSOR,
        imageSrc: require('./assets/gps_icon.png'),  // TODO: Update icon!
        class: GPS,
        measure: "Coordinates",
        units: "°",
        description: {
            measure: "Your current location on the globe",
            output: "lat and long per sample rate, representing current global position"
        }
    },
    [SensorType.BACK_CAMERA]: {
        name: "Camera",
        type: HardwareType.RECORDER,
        imageSrc: require('./assets/camera_icon.png'),
        class: BackCameraRecorder, // TODO: Set correct class!
        // TODO: Update description!
        measure: "Video",
        units: "",
        description: {
            measure: "Video feed of the back camera",
            output: "MP4 file, saved to device"
        }
    }
}

export const getSensorClass = (type) => {
    if (!(type in SensorInfo)) {
        throw new Error('Sensors.getSensorClass: Received an unknown type, ' + type);
    }

    return SensorInfo[type].class;
};

export const getSensorFileName = (type) => {
    return getSensorClass(type).prototype.constructor.name + '.csv';
};

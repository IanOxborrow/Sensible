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
        fileExt: ".csv",
        class: Accelerometer,
        measure: "Acceleration",
        units: "m/s^2",
        description: {
            measure: "Rate of change of velocity (how fast you move the phone)",
            output: "x per sample, representing current velocity (m/s^2)"
        }
    },
    [SensorType.GYROSCOPE]: {
        name: "Gyroscope",
        type: HardwareType.SENSOR,
        imageSrc: require('./assets/gyroscope_icon.png'),
        fileExt: ".csv",
        class: Gyroscope,
        measure: "Angular velocity",
        units: "RPS",
        description: {
            measure: "Angular velocity (how fast you rotate the phone)",
            output: "x, y, z per sample, representing each vector's angular velocity (m/s^2)"
        }
    },
    [SensorType.MAGNETOMETER]: {
        name: "Magnetometer",
        type: HardwareType.SENSOR,
        imageSrc: require('./assets/magnetometer_icon.png'),
        fileExt: ".csv",
        class: Magnetometer,
        measure: "Magnetic Field Direction",
        units: "μT",
        description: {
            measure: "Magnetic field direction (how strong a magnetic field is)",
            output: "ADD OUTPUT HERE"
        }
    },
    [SensorType.BAROMETER]: {
        name: "Barometer",
        type: HardwareType.SENSOR,
        imageSrc: require('./assets/barometer_icon.png'),
        fileExt: ".csv",
        class: Barometer,
        measure: "Atmospheric Pressure",
        units: "psi",
        description: {
            measure: "Atmospheric pressure (pressure of your environment)",
            output: "Pressure per sample, representing the atmospheric pressure"
        }
    },
    [SensorType.MICROPHONE]: {
        name: "Microphone",
        type: HardwareType.RECORDER,
        imageSrc: require('./assets/microphone_icon.png'),
        fileExt: ".mp3",
        class: MicrophoneRecorder,
        measure: "Amplitude",
        units: "dB",
        description: {
            measure: "Audio (what your phone hears)",
            output: "MP3 file"
        }
    },
    [SensorType.GPS]: {
        name: "GPS",
        type: HardwareType.SENSOR,
        imageSrc: require('./assets/gps_icon.png'),
        fileExt: ".csv",
        class: GPS,
        measure: "Coordinates",
        units: "°",
        description: {
            measure: "Your current location on the globe",
            output: "Latitude and longitude per sample, representing current global position"
        }
    },
    [SensorType.BACK_CAMERA]: {
        name: "Camera",
        type: HardwareType.RECORDER,
        imageSrc: require('./assets/camera_icon.png'),
        fileExt: ".mp4",
        class: BackCameraRecorder,
        measure: "Video",
        units: "",
        description: {
            measure: "Video feed of the back camera",
            output: "MP4 file"
        }
    }
}

export const getSensorClass = (sensorId) => {
    if (!(sensorId in SensorInfo)) {
        throw new Error('Sensors.getSensorClass: Received an unknown type, ' + sensorId);
    }

    return SensorInfo[sensorId].class;
};

export const getSensorFileName = (type) => {
    return getSensorClass(type).prototype.constructor.name + SensorInfo[type].fileExt;
};

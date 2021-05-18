/* eslint-disable prettier/prettier */
<<<<<<< HEAD
import {Accelerometer, SensorType, GenericTimeframe, Mic} from './Sensors';
=======
import { Accelerometer, SensorType, GenericTimeframe, Mic, Gyroscope, Magnetometer, Barometer } from "./Sensors";
import Label from "./sensors/Label"
>>>>>>> 9bff0cf7720bce6b9c79993bf964a55bcfc2c3e7
import {PermissionsAndroid} from "react-native";

export default class Recording {
    constructor() {
        this.sampleRate = 40000; // in Hz
        this.enabledSensors = {};
        this.graphableData = {};
        this.logicalTime = 0;
        this.labels = [];
    }

    /**
     * Add a sensor to record data from
     *
     * @param type The type of sensor to add. For example, SensorType.ACCELEROMETER
     */
    addSensor(type) {
        // TODO : Set this to the number of data points that is displayed on the graph
        const pointsOnGraph = 500; // The number of points that is stored in the graph
        const timeframeBufferSize = 50;
        switch (type)
        {
            case SensorType.ACCELEROMETER:
                // Create the timeframe array for the accelerometer (with an initial timeframe)
                this.graphableData[type] = [new GenericTimeframe(pointsOnGraph, timeframeBufferSize)];
                // Create a new accelerometer instance to track and enable it
                this.enabledSensors[type] = new Accelerometer(this.graphableData[type], this.sampleRate);
                break;
<<<<<<< HEAD
=======
            case SensorType.GYROSCOPE:
                // Create the timeframe array for the gyroscope (with an initial timeframe)
                this.graphableData[type] = [new GenericTimeframe(this.timeframeSize, this.bufferSize)];
                // Create a new gyroscope instance to track and enable it
                this.enabledSensors[type] = new Gyroscope(this.graphableData[type], this.sampleRate);
                break;
            case SensorType.MAGNETOMETER:
                // Create the timeframe array for the magnetometer (with an initial timeframe)
                this.graphableData[type] = [new GenericTimeframe(this.timeframeSize, this.bufferSize)];
                // Create a new magnetometer instance to track and enable it
                this.enabledSensors[type] = new Magnetometer(this.graphableData[type], this.sampleRate);
                break;
            case SensorType.BAROMETER:
                // Create the timeframe array for the magnetometer (with an initial timeframe)
                this.graphableData[type] = [new GenericTimeframe(this.timeframeSize, this.bufferSize)];
                // Create a new barometer instance to track and enable it
                this.enabledSensors[type] = new Barometer(this.graphableData[type], this.sampleRate);
                break;
>>>>>>> 9bff0cf7720bce6b9c79993bf964a55bcfc2c3e7
            case SensorType.MICROPHONE:
                // console.warn('Recording.addSensor(SensorType.MICROPHONE) has not been implemented');

                // request microphone permission
                const requestMicPermission = async () => {
                    try {
                        const granted = await PermissionsAndroid.request(
                            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                            {
                                title: "Microphone Permission",
                                message:
                                    "This app needs access to your microphone " +
                                    "in order to collect microphone data",
                                buttonNeutral: "Ask Me Later",
                                buttonNegative: "Cancel",
                                buttonPositive: "OK"
                            }
                        );
                        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                            console.log("You can use the microphone");
                        } else {
                            console.log("Microphone permission denied");
                        }
                    } catch (err) {
                        console.warn(err);
                    }
                };

                requestMicPermission();

                this.graphableData[type] = [new GenericTimeframe(pointsOnGraph, timeframeBufferSize)];
                this.enabledSensors[type] = new Mic(this.graphableData[type], this.sampleRate);

                break;
            default:
                throw new Error(this.constructor.name + '.addSensor: Received an unrecognised sensor type with id=' + type);
        }
    }

    /**
     * Create a new label which can later be added to a timeframe.
     * @param name The name of the label
     */
    createLabel(name)
    {
        // Code
    }

    /**
     * Returns a reference to the latest timeframe of that sensor
     * @param type The type of sensor they would like to get the timeframe for
     * @return The latest timeframe for the specified sensor
     */
    getSensorData(type) {
        let sensorData = this.graphableData[type];
        return sensorData[sensorData.length - 1];
    }
}

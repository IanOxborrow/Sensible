/* eslint-disable prettier/prettier */
import {Accelerometer, SensorType, GenericTimeframe, Mic} from './Sensors';
import {PermissionsAndroid} from "react-native";

export default class Recording {
    constructor() {
        this.sampleRate = 40000; // in Hz
        this.enabledSensors = {};
        this.graphableData = {};
        this.logicalTime = 0;
    }

    /**
     * Add a sensor to record data from
     *
     * @param type The type of sensor to add. For example, SensorType.ACCELEROMETER
     */
    addSensor(type) {
        // TODO : Set this to the number of data points that is displayed on the graph
        const pointsOnGraph = 10; // The number of points that is stored in the graph
        const timeframeBufferSize = 20;
        switch (type) {
            case SensorType.ACCELEROMETER:
                // Create the timeframe array for the accelerometer (with an initial timeframe)
                this.graphableData[type] = [new GenericTimeframe(pointsOnGraph, timeframeBufferSize)];
                // Create a new accelerometer instance to track and enable it
                this.enabledSensors[type] = new Accelerometer(this.graphableData[type], this.sampleRate);
                break;
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
     * Returns a reference to the latest timeframe of that sensor
     * @param type The type of sensor they would like to get the timeframe for
     * @return The latest timeframe for the specified sensor
     */
    getSensorData(type) {
        let sensorData = this.graphableData[type];
        return sensorData[sensorData.length - 1];
    }
}

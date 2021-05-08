/* eslint-disable prettier/prettier */
import { Accelerometer, SensorType, GenericTimeframe, Mic, Gyroscope, Magnetometer } from "./Sensors";
import Label from "./sensors/Label"
import {PermissionsAndroid} from "react-native";

export default class Recording {
    constructor() {
        this.sampleRate = 40000; // in Hz
        this.bufferSize = 5; // The number of samples to store in the buffer before saving all of them to file at once
        this.timeframeSize = 10; // The number of samples in a timeframe. Additional points will be saved to file.
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
        switch (type)
        {
            case SensorType.ACCELEROMETER:
                // Create the timeframe array for the accelerometer (with an initial timeframe)
                this.graphableData[type] = [new GenericTimeframe(this.timeframeSize, this.bufferSize)];
                // Create a new accelerometer instance to track and enable it
                this.enabledSensors[type] = new Accelerometer(this.graphableData[type], this.sampleRate);
                break;
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

                this.graphableData[type] = [new GenericTimeframe(this.timeframeSize, this.bufferSize)];
                this.enabledSensors[type] = new Mic(this.graphableData[type], this.sampleRate);;

                break;
            default:
                throw new Error(this.constructor.name + '.addSensor: Received an unrecognised sensor type with id=' + type);
        }
    }

    /**
     * Set the label for all incoming data from hereon
     * @param name The name of the label
     */
    setLabel(name)
    {
        // Finalise the old label
        if (this.labels.length > 0 && this.labels[this.labels.length - 1].endTime == null)
        {
            this.labels[this.labels.length - 1].endTime = Date.now();
        }
        // Create the new label
        let label = new Label(name, Date.now());
        this.labels.push(label);
        // Create a new timeframe for each sensor
        for (const value of Object.values(this.graphableData))
        {
            value.push(new GenericTimeframe(this.timeframeSize, this.bufferSize, label));
        }
        // TODO: Asynchronously save all data from the previous timeframe to file
    }

    /**
     * Returns a reference to the latest timeframe of that sensor
     * @param type The type of sensor they would like to get the timeframe for
     * @return The latest timeframe for the specified sensor
     */
    getSensorData(type) {
        // Throw an error if the sensor hasn't been initialised
        if (this.graphableData[type] == null)
        {
            throw new Error("Recording.getSensorData: Attempted to get sensor data for type-" + type +
                " but it has not been initialised correctly if at all.");
        }

        let sensorData = this.graphableData[type];
        return sensorData[sensorData.length - 1];
    }
}

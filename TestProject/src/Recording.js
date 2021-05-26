/* eslint-disable prettier/prettier */
import {
    Accelerometer,
    SensorType,
    GenericTimeframe,
    Mic,
    Gyroscope,
    Magnetometer,
    Barometer,
    getSensorClass,
} from "./Sensors";
import Label from "./sensors/Label"
import {PermissionsAndroid, Platform} from "react-native";
import {PERMISSIONS, check, request, RESULTS} from 'react-native-permissions';

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
     * Initialise a new sensor and a generic timeframe
     * @param type The type of the sensor to initialise
     */
    initialiseGenericSensor(type)
    {
        const sensorClass = getSensorClass(type);
        // Create the timeframe array for the sensor (with an initial timeframe)
        this.graphableData[type] = [new GenericTimeframe(this, this.timeframeSize, this.bufferSize, type)];
        // Create a new sensor instance to track and enable it
        this.enabledSensors[type] = new sensorClass(this.graphableData[type], this.sampleRate);
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
                this.initialiseGenericSensor(SensorType.ACCELEROMETER);
                break;
            case SensorType.GYROSCOPE:
                this.initialiseGenericSensor(SensorType.GYROSCOPE);
                break;
            case SensorType.MAGNETOMETER:
                this.initialiseGenericSensor(SensorType.MAGNETOMETER);
                break;
            case SensorType.BAROMETER:
                this.initialiseGenericSensor(SensorType.BAROMETER);
                break;
            case SensorType.MICROPHONE:
                // console.warn('Recording.addSensor(SensorType.MICROPHONE) has not been implemented');

                // request microphone permission
                const requestMicPermission = async () => {
                    if (Platform.OS === 'ios') {
                        const granted = await check(PERMISSIONS.IOS.MICROPHONE);
                        if (granted == RESULTS.GRANTED) {
                            console.log("iOS - You can use the microphone")
                        }
                    } else {
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
                    }
                };

                requestMicPermission();
                this.initialiseGenericSensor(SensorType.MICROPHONE);

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
        for (const sensorTimeframe of Object.values(this.graphableData))
        {
            sensorTimeframe.push(new GenericTimeframe(this, this.timeframeSize, this.bufferSize, sensorTimeframe[0].type, label));
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

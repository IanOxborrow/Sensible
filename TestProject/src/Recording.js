/* eslint-disable prettier/prettier */
import {GenericTimeframe, toSensorType, getSensorClass, getSensorFileName, SensorType,} from "./Sensors";
import Label from './sensors/Label';
import {NativeModules, PermissionsAndroid, Platform} from 'react-native';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Share from 'react-native-share';
import RecordingManager from "./RecordingManager";

const { ofstream } = NativeModules;

export default class Recording {
    constructor(name, folderPath) {
        this.name = name; // TODO: Throw an error if a # or any non-alphanumeric characters are thrown
        this.folderPath = folderPath === undefined ? RecordingManager.SAVE_FILE_PATH + this.name.replace(/ /g, '_') + '/' : folderPath;
        this.sampleRate = 40000; // in Hz
        this.bufferSize = 5; // The number of samples to store in the buffer before saving all of them to file at once
        this.timeframeSize = 10; // The number of samples in a timeframe. Additional points will be saved to file.
        this.enabledSensors = {}; // TODO: Do a final flush of the buffer once the recording is finished
        this.graphableData = {};
        this.writeStreams = {};
        this.fileStreamIndices = {};
        this.logicalTime = 0;
        this.labels = [];

        // TODO: Make this platform independent!
        if (folderPath === undefined && Platform.OS !== 'ios') {
            // Create the folder if it doesn't already exist
            ofstream.mkdir(this.folderPath)
                .then(() => {
                    console.log('Successfully created folder ' + this.folderPath);
                })
                .catch(err => {
                    throw Error(err);
                });

            // Create the metadata file
            const infoFilePath = this.folderPath + 'info.txt';
            ofstream.writeOnce(infoFilePath, false, 'Recording name: ' + this.name)
                .then(() => {
                    console.log('Successfully created ' + infoFilePath);
                })
                .catch(err => {
                    throw new Error(this.constructor.name + '.initialiseGenericSensor: ' + err);
                });

            // Append to the recording list
            ofstream.writeOnce(RecordingManager.SAVE_FILE_PATH + "recordings.config", true, this.toString() + "\n");
        }
    }

    /**
     * Initialise a new sensor and a generic timeframe
     * @param type The type of the sensor to initialise
     */
    async initialiseGenericSensor(type)
    {
        const sensorClass = getSensorClass(type);
        const sensorFile = this.folderPath + getSensorFileName(type);
        // Create the timeframe array for the sensor (with an initial timeframe)
        this.graphableData[type] = [new GenericTimeframe(this, this.timeframeSize, this.bufferSize, type)];
        // Create a new sensor instance to track and enable it
        this.enabledSensors[type] = new sensorClass(this.graphableData[type], this.sampleRate);

        // TODO: Make this platform independent!
        if (Platform.OS !== 'ios') {
            // Create a new file and store the stream index for later
            this.fileStreamIndices[type] = await ofstream.open(sensorFile, false);
        }

    }

    /**
     * Add a sensor to record data from
     *
     * @param type The type of sensor to add. For example, SensorType.ACCELEROMETER
     */
    async addSensor(type) {
        switch (Number(type))
        {
            case SensorType.ACCELEROMETER:
                await this.initialiseGenericSensor(SensorType.ACCELEROMETER);
                break;
            case SensorType.GYROSCOPE:
                await this.initialiseGenericSensor(SensorType.GYROSCOPE);
                break;
            case SensorType.MAGNETOMETER:
                await this.initialiseGenericSensor(SensorType.MAGNETOMETER);
                break;
            case SensorType.BAROMETER:
                await this.initialiseGenericSensor(SensorType.BAROMETER);
                break;
            case SensorType.MICROPHONE:
                // console.warn('Recording.addSensor(SensorType.MICROPHONE) has not been implemented');

                // request microphone permission
                if (Platform.OS === 'ios') {
                    const granted = await check(PERMISSIONS.IOS.MICROPHONE);
                    if (granted == RESULTS.GRANTED) {
                        console.log('iOS - You can use the microphone');
                    }
                } else {
                    try {
                        const granted = await PermissionsAndroid.request(
                            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                            {
                                title: 'Microphone Permission',
                                message:
                                    'This app needs access to your microphone ' +
                                    'in order to collect microphone data',
                                buttonNeutral: 'Ask Me Later',
                                buttonNegative: 'Cancel',
                                buttonPositive: 'OK',
                            }
                        );
                        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                            console.log('You can use the microphone');
                        } else {
                            console.log('Microphone permission denied');
                        }
                    } catch (err) {
                        console.warn(err);
                    }
                }

                await this.initialiseGenericSensor(SensorType.MICROPHONE);
                break;
            case SensorType.BACK_CAMERA:
                console.log('was camera')
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
            throw new Error('Recording.getSensorData: Attempted to get sensor data for type-' + type +
                ' but it has not been initialised correctly if at all.');
        }

        let sensorData = this.graphableData[type];
        return sensorData[sensorData.length - 1];
    }

    /**
     * Open the share menu to download the sensor file
     * @param type The type of sensor they would like to get the timeframe for
     */
    async shareSensorFile(type)
    {
        // TODO: Make the platform independent!
        if (Platform.OS === 'ios') {
            return;
        }

        const streamIndex = this.fileStreamIndices[SensorType.ACCELEROMETER]
        const fileOpened = streamIndex == null ? false : await ofstream.isOpen(this.fileStreamIndices[SensorType.ACCELEROMETER]);
        // Make sure the writing stream has been closed before accessing the file
        if (fileOpened)
        {
            throw new Error("Recording.shareSensorFile: File cannot be shared as it is " +
                "currently opened. File type: " + type);
        }

        // Open the share menu to allow downloading the file
        const fileName = getSensorFileName(type);
        const path = 'file://' + this.folderPath + fileName;
        Share.open({
            url: path,
            subject: fileName,
        });
    }

    /**
     * Finalise the recording and save everything to file
     * @param clear True if all created files should be deleted (use if the recording has been cancelled)
     */
    finish(clear = false)
    {
        // TODO: Do something for clear
        for (const [sensorType, fileStreamIndex] of Object.entries(this.fileStreamIndices))
        {
            // TODO: Add implementation for all sensors
            if (sensorType == SensorType.BACK_CAMERA || sensorType == SensorType.GPS) {
                continue;
            }

            // Disable all sensors
            this.enabledSensors[sensorType].disable();
            // TODO: Make this platform independent!
            if (Platform.OS !== 'ios') {
                // Close all the write streams
                ofstream.close(fileStreamIndex);
            }
        }
    }

    toString() {
        return this.name + ";" + this.folderPath;
    }
}

/* eslint-disable prettier/prettier */
import {
    GenericTimeframe,
    toSensorType,
    getSensorClass,
    getSensorFileName,
    SensorType,
    MicrophoneRecorder,
    BackCameraRecorder
} from "./Sensors";
import Label from './sensors/Label';
import {NativeModules, PermissionsAndroid, Platform} from 'react-native';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Share from 'react-native-share';
import RecordingManager from "./RecordingManager";
import RNFetchBlob from "rn-fetch-blob";

const { ofstream } = NativeModules;

export default class Recording {
    constructor(name, folderPath) {
        this.name = name; // TODO: Throw an error if a # or any non-alphanumeric characters are thrown
        this.folderPath = folderPath === undefined ? RecordingManager.SAVE_FILE_PATH + this.name.replace(/ /g, '_') + '/' : folderPath;
        this.sampleRate = 40000; // in Hz
        this.bufferSize = 5; // The number of samples to store in the buffer before saving all of them to file at once
        this.timeframeSize = 10; // The number of samples in a timeframe. Additional points will be saved to file.
        this.enabledSensors = {};
        this.enabledRecorders = {};
        this.graphableData = {};
        this.fileStreamIndices = {};
        this.logicalTime = 0;
        this.labels = [];

        console.log("recording")
        console.log(this.folderPath)

        // TODO: Make this platform independent!
        if (folderPath === undefined) {

            // Create the folder if it doesn't already exist
            /*RNFetchBlob.fs.mkdir(this.folderPath).then(() => {
                console.log('Successfully created folder ' + this.folderPath);
            }).catch(err => {
                throw Error(err);
            });*/

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
            /*
            RNFetchBlob.fs.writeStream(infoFilePath, 'utf8', false)
                .then((stream) => {
                    stream.write('Recording name: ' + this.name)
                    return stream.close()
                })
            */

            // Append to the recording list
            ofstream.writeOnce(RecordingManager.SAVE_FILE_PATH + "recordings.config", true, this.toString() + "\n");
            /*RNFetchBlob.fs.writeStream(RecordingManager.SAVE_FILE_PATH + "recordings.config", 'utf8', true)
                .then((stream) => {
                    stream.write(this.toString() + "\n")
                    return stream.close()
                })*/

        } else if (folderPath === undefined && Platform.OS == 'ios') {
            console.log("using ios")
        }
    }

    /**
     * Initialise a new sensor and a generic timeframe
     *
     * @param type       The type of the sensor to initialise
     * @param sampleRate The rate at which barometer data should be sampled
     */

    async initialiseGenericSensor(type, sampleRate) {

        const sensorClass = getSensorClass(type);
        const sensorFile = this.folderPath + getSensorFileName(type);
        // Create the timeframe array for the sensor (with an initial timeframe)
        this.graphableData[type] = [new GenericTimeframe(this, this.timeframeSize, this.bufferSize, type)];
        // Create a new sensor instance to track and enable it
        this.enabledSensors[type] = new sensorClass(this.graphableData[type], sampleRate);

        // Create a new file and store the stream index for later
        this.fileStreamIndices[type] = await ofstream.open(sensorFile, false);
        
    }

    /**
     * Add a sensor to record data from
     *
     * @param type       The type of sensor to add. For example, SensorType.ACCELEROMETER
     * @param sampleRate The rate at which barometer data should be sampled
     */
    async addSensor(type, sampleRate) {
        switch (Number(type))
        {
            case SensorType.ACCELEROMETER:
                await this.initialiseGenericSensor(SensorType.ACCELEROMETER, sampleRate);
                break;
            case SensorType.GYROSCOPE:
                await this.initialiseGenericSensor(SensorType.GYROSCOPE, sampleRate);
                break;
            case SensorType.MAGNETOMETER:
                await this.initialiseGenericSensor(SensorType.MAGNETOMETER, sampleRate);
                break;
            case SensorType.BAROMETER:
                await this.initialiseGenericSensor(SensorType.BAROMETER, sampleRate);
                break;
            case SensorType.GPS:
                // request GPS permission
                if (Platform.OS == 'ios') {
                    const authorisation = await requestAuthorization('whenInUse');
                    if (authorisation == 'granted' || authorisation == 'restricted') {
                        console.log('iOS - You can use the GPS');
                    } else {
                        // TODO: Stop the initialisation if permission is denied
                    }
                } else {
                   try {
                      const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                         {
                             title: 'Location Permission',
                             message:
                                 'This app needs access to your location ' +
                                 'in order to collect location data',
                             buttonNeutral: 'Ask Me Later',
                             buttonNegative: 'Cancel',
                             buttonPositive: 'OK',
                         }
                         );
                         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                             console.log('You can use the GPS');
                         } else {
                             console.log('GPS permission denied');
                             // TODO: Stop the initialisation if permission is denied
                         }
                     } catch (err) {
                         console.warn(err);
                     }
                 }
                await this.initialiseGenericSensor(SensorType.GPS, sampleRate);
                break;
            // case SensorType.MICROPHONE:
            //     // console.warn('Recording.addSensor(SensorType.MICROPHONE) has not been implemented');
            //
            //     // request microphone permission
            //     if (Platform.OS === 'ios') {
            //         const granted = await check(PERMISSIONS.IOS.MICROPHONE);
            //         if (granted == RESULTS.GRANTED) {
            //             console.log('iOS - You can use the microphone');
            //         }
            //     } else {
            //         try {
            //             const granted = await PermissionsAndroid.request(
            //                 PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            //                 {
            //                     title: 'Microphone Permission',
            //                     message:
            //                         'This app needs access to your microphone ' +
            //                         'in order to collect microphone data',
            //                     buttonNeutral: 'Ask Me Later',
            //                     buttonNegative: 'Cancel',
            //                     buttonPositive: 'OK',
            //                 }
            //             );
            //             if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //                 console.log('You can use the microphone');
            //             } else {
            //                 console.log('Microphone permission denied');
            //             }
            //         } catch (err) {
            //             console.warn(err);
            //         }
            //     }
            //
            //     await this.initialiseGenericSensor(SensorType.MICROPHONE);
            //     break;
            default:
                throw new Error(this.constructor.name + '.addSensor: Received an unrecognised sensor type with id=' + type);
        }
    }

    /**
     * Add a recorder
     *
     * @param type The type of recorder to add. For example, SensorType.BACK_CAMERA
     */
    addRecorder(type) {
        switch (Number(type)) {
            case SensorType.BACK_CAMERA:
                this.enabledRecorders[type] = new BackCameraRecorder(this);
                break;
            case SensorType.MICROPHONE:
                this.enabledRecorders[type] = new MicrophoneRecorder(this);
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

        const streamIndex = this.fileStreamIndices[SensorType.ACCELEROMETER]
        const fileOpened = streamIndex == null ? false : await ofstream.isOpen(this.fileStreamIndices[SensorType.ACCELEROMETER]);
        
        // Make sure the writing stream has been closed before accessing the file
        if (fileOpened && Platform.OS != 'ios')
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
     * Enable all sensors and start all recorders
     */
    async start() {
        // Enable each sensor
        for (const sensorType of Object.keys(this.enabledSensors)) {
            this.enabledSensors[sensorType].enable();
        }

        // Enable each recorder
        // TODO: Check that the recorders started without errors
        for (const sensorType of Object.keys(this.enabledRecorders)) {
            this.enabledRecorders[sensorType].record();
        }
    }

    /**
     * Finalise the recording and save everything to file
     * @param clear True if all created files should be deleted (use if the recording has been cancelled)
     */
    async finish(clear = false)
    {
        // TODO: Do something for clear
        // Disable each sensor and its file stream
        for (const [sensorType, fileStreamIndex] of Object.entries(this.fileStreamIndices)) {
            // Disable all sensors
            this.enabledSensors[sensorType].disable();
            
            await ofstream.close(fileStreamIndex);
            
        }

        // Stop all recorders
        for (const sensorType of Object.keys(this.enabledRecorders)) {
            await this.enabledRecorders[sensorType].stop();
        }
    }

    toString() {
        return this.name + ";" + this.folderPath;
    }
}

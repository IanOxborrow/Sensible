import {NativeModules, Platform} from 'react-native';
import RNFetchBlob from "rn-fetch-blob";
import {getSensorClass, HardwareType, SensorInfo, SensorType} from "./Sensors";

const { ofstream } = NativeModules;

export default class RecordingManager {
    // Store all recordings
    static recordings = [];
    // Store the current recording (ie. any new recordings that haven't been finalised)
    static currentRecording = null;
    static SAVE_FILE_PATH = RNFetchBlob.fs.dirs.DocumentDir + '/';
    static CONFIG_FILE_PATH = RecordingManager.SAVE_FILE_PATH + "config.json";
    static DEFAULT_MAX_SAMPLE_RATE = 180; // in Hz
    static DEFAULT_MIN_SAMPLE_RATE = 1; // in Hz
    static sampleRatesCalculated = 1;
    // A reference to the class which holds a recording
    static RecordingClass;

    /**
     * Load all stored recordings into RecordingManager.recordings
     *
     * @return {Promise<void>}
     */
    static async loadRecordings() {
        //make sure that the recordings file actually exists
        const recordingExists = await ofstream.exists(this.SAVE_FILE_PATH + "recordings.config")
            .then((exists) => {
                return exists
            })

        //if it does not exist return early as there is nothing to read
        if (!recordingExists) {
            return
        }

        //read the contents of the file into a string called content
        const content = await ofstream.read(this.SAVE_FILE_PATH + "recordings.config")
            .then(content => {
                return content
            })

        //split the string so that it can be displayed more easily
        const recordings = content.split("\n");
        console.log(recordings)

        for (let i = 0; i < recordings.length - 1; i++) {
            const params = recordings[i].split(";");

            // Prepare the necessary data
            const metadata = JSON.parse(await ofstream.read(params[1] + "info.json"));
            let enabledSensors = {}
            let enabledRecorders = {}
            for (const sensor of metadata["sensors"]) {
                enabledSensors[sensor["id"]] = null;
            }
            for (const recorder of metadata["recorders"]) {
                enabledRecorders[recorder["id"]] = null;
            }

            // Instantiate a new recording class
            const recording = new this.RecordingClass(params[0], params[1], enabledSensors, enabledRecorders);
            recording.id = metadata.id
            this.recordings.push({
                title: recording.name,
                id: recording.id,
                info: recording
            });
        }
    }

    /**
     * Saves the sampling rates of each sensor
     *
     * THIS FUNCTION HAS BEEN DISABLED
     * This has been disabled  due to the extra time (3 mins of running time) required to
     * calculate the maximum sampling. Instead a fixed maximum sampling rate will be used.
     * To enable this function again set RecordingManager.sampleRatesCalculated to 0.
     * Then the next time a recording is run for 3 minutes, a config function with the
     * "maximum" rates will be generated. One issue with this function is that if the
     * recording is started with a sampling rate that is not the maximum, that will be
     * set as the "maximum". This function will get called by the enable() function of
     * each sensor and once the sampling rate of each sensor has been calculated, the
     * file will be generated.
     *
     * @return {Promise<void>}
     */
    static async saveConfig() {
        // Save the config data if it doesn't already exist
        if (RecordingManager.sampleRatesCalculated === 0) {
            let output = "";
            for (const sensorId of Object.values(SensorType)) {
                if (SensorInfo[sensorId].type != HardwareType.SENSOR) {
                    continue;
                }

                // Exit if the sample rate of all sensors haven't been calculated
                const sensorClass = getSensorClass(sensorId);
                if (!sensorClass.sampleRateCalculated) {
                    return;
                }

                const rate = await sensorClass.getMaxSampleRate(true);
                output += sensorId + "," + rate + "\n";
                console.log("The max sample rate of " + sensorId + " is " + rate);
            }
            await ofstream.writeOnce(RecordingManager.CONFIG_FILE_PATH, false, output);
        }
    }

    static async loadConfig() {
        const configData = await ofstream.read(RecordingManager.CONFIG_FILE_PATH);
        if (configData !== "") {
            for (const line of configData.split("\n")) {
                if (line === "") {
                    continue;
                }

                const data = line.split(",");
                const sensorId = Number(data[0]);
                const rate = Number(data[1]);
                getSensorClass(sensorId).maxSampleRate = rate;
                getSensorClass(sensorId).sensorWorking = rate > -1;
                RecordingManager.sampleRatesCalculated++;
            }
        }
    }

    static generateRecordingId() {
        for (let id = 1; id < RecordingManager.recordings.length + 2; id++) {
            if (!RecordingManager.recordings[id - 1] || RecordingManager.recordings[id - 1].id != id) {
                return id;
            }
        }
    }
}

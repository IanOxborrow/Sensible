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
            this.recordings.push({
                title: recording.name,
                id: this.recordings.length + 1,
                info: recording
            });
        }
    }

    static async loadConfig() {
        // TODO: Hard-code the values
        const configPath = RecordingManager.SAVE_FILE_PATH + "config.json"
        const configData = await ofstream.read(configPath);
        if (configData === "") {
            let output = "";
            for (const type of Object.values(SensorType)) {
                if (SensorInfo[type].type != HardwareType.SENSOR) {
                    continue;
                }

                const rate = await getSensorClass(type).getMaxSampleRate();
                output += type + "," + rate + "\n";
                console.log("The max sample rate of " + type + " is " + rate);
            }
            await ofstream.writeOnce(configPath, false, output);
        }
        else {
            for (const line of configData.split("\n")) {
                if (line === "") {
                    continue;
                }

                const data = line.split(",");
                const sensorId = Number(data[0]);
                const rate = Number(data[1]);
                getSensorClass(sensorId).maxSampleRate = rate;
                getSensorClass(sensorId).sensorWorking = rate > -1;
            }
        }
    }
}

import {NativeModules, Platform} from 'react-native';
import RNFetchBlob from "rn-fetch-blob";
import {SensorType} from "./Sensors";

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
        // TODO: Make this platform independent!
        if (Platform.OS === 'ios') {
            return;
        }

        const content = await ofstream.read(this.SAVE_FILE_PATH + "recordings.config");
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
}

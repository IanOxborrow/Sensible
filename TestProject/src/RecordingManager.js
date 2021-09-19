import {NativeModules, Platform} from 'react-native';
import RNFetchBlob from "rn-fetch-blob";

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
        console.log("loading recordings")

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
            const recording = new this.RecordingClass(params[0], params[1]);
            this.recordings.push({
                title: recording.name,
                id: this.recordings.length + 1,
                info: recording
            });
        }
    }
}

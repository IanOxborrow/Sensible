import {NativeModules} from 'react-native';
import App from "../App";
import Recording from "./Recording";

const { ofstream } = NativeModules;

export default class RecordingManager {
    constructor() {
        this.recordings = []
        ofstream.read(App.SAVE_FILE_PATH + "recordings.config").then(content => {
            const recordingFolders = content.split("\n");
            for (let i = 0; i < recordingFolders.length - 1; i++) {
                const params = recordingFolders[i].split(";");
                const recording = new Recording(params[0], params[1]);
                this.recordings.push({
                    title: recording.name,
                    id: this.recordings.length + 1,
                    info: recording
                });
            }
        });
    }
}

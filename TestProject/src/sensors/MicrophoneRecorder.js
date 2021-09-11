import Sensor from './Sensor';
import {RNCamera} from "react-native-camera";
import {Dimensions} from "react-native";
import React from "react";
import Recorder from "./Recorder";
import AudioRecorderPlayer from "react-native-audio-recorder-player";

export default class BackCameraRecorder extends Recorder {
    /**
     * @param recording A reference to the recording class that this recorder is stored under
     */
    constructor(recording) {
        super(recording);
        this.filePath = this.recording.folderPath + "Microphone.mp4";
        this.audioRecorderPlayer = new AudioRecorderPlayer();
        this.isRecording = false;
        this.duration = 0;
        this.loudness = 0;
    }

    /**
     * Created by Chathura Galappaththi
     *
     * Record from the microphone and save it to file
     *
     * @return {Promise<void>}
     */
    async record() {
        if (!this.isRecording) {
            await this.audioRecorderPlayer.startRecorder(this.filePath, null, true);
            this.audioRecorderPlayer.addRecordBackListener((e) => {
                this.duration = e.currentPosition;
                this.loudness = e.currentMetering;
            });
            this.isRecording = true;
            console.log("Microphone: Recording has started...")
        }
    }

    /**
     * Created by Chathura Galappaththi
     *
     * Stop the recording
     *
     * @return {Promise<void>}
     */
    async stop() {
        if (this.isRecording) {
            console.log("Microphone: Stopping recording...")
            const result = await this.audioRecorderPlayer.stopRecorder();
            this.audioRecorderPlayer.removeRecordBackListener();
            this.duration = 0;
            this.isRecording = false;
            console.log("Microphone: Recording has stopped")
            console.log(result);
        }
    }

    /**
     * Created by Chathura Galappaththi
     *
     * Get the duration of the current recording
     *
     * @param raw               True to get the value in seconds
     * @return {number|string}
     */
    getDuration(raw = false) {
        return raw ? this.duration : this.audioRecorderPlayer.mmssss(this.duration);
    }
}

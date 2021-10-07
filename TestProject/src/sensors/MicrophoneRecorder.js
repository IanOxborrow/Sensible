import {PermissionsAndroid, Platform} from "react-native";
import React from "react";
import Recorder from "./Recorder";
import AudioRecorderPlayer from "react-native-audio-recorder-player";
import {PERMISSIONS, check, request, RESULTS} from 'react-native-permissions';

export default class MicrophoneRecorder extends Recorder {
    static sensorWorking = null;
    static permissionsSatisfied = false;

    /**
     * @param recording A reference to the recording class that this recorder is stored under
     */
    constructor(recording) {
        super(recording);
        this.filePath = this.recording.folderPath + "Microphone.mp3";
        this.audioRecorderPlayer = new AudioRecorderPlayer();
        this.isRecording = false;
        this.duration = 0;
        this.loudness = 0;
    }

    /**
     * Requests any permissions required for this sensor
     */
    static async requestPermissions() {
        // request microphone permission
        if (Platform.OS === 'ios') {
            const granted = await check(PERMISSIONS.IOS.MICROPHONE);
            if (granted == RESULTS.GRANTED) {
                console.log('iOS - You can use the microphone');
                MicrophoneRecorder.permissionsSatisfied = true;
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
                    MicrophoneRecorder.permissionsSatisfied = true;
                } else {
                    console.log('Microphone permission denied');
                }
            } catch (err) {
                console.warn(err);
            }
        }
    }

    /**
     * Created by ?
     *
     * Checks whether the sensor is able to be used
     *
     * @return True if the sensor is working, False otherwise
     */
    static async isSensorWorking() {
        // TODO: Check whether this sensor is working!
        MicrophoneRecorder.sensorWorking = MicrophoneRecorder.permissionsSatisfied;
        return MicrophoneRecorder.sensorWorking;
    }

    /**
     * This should be used only where necessary and only if isSensorWorking()
     * has already been called at least once
     *
     * @return {boolean} True if the sensor is working, False otherwise
     */
    static isSensorWorkingSync() {
        if (MicrophoneRecorder.sensorWorking == null) {
            console.warn("MicrophoneRecorder.sensorWorking: sensor status has not been established");
            return false;
        }

        return MicrophoneRecorder.sensorWorking;
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

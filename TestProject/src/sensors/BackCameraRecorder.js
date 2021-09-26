import Sensor from './Sensor';
import {RNCamera} from "react-native-camera";
import {Dimensions} from "react-native";
import React from "react";
import Recorder from "./Recorder";
import {sleep} from "../Utilities";

export default class BackCameraRecorder extends Recorder {
    /**
     * @param recording A reference to the recording class that this recorder is stored under
     */
    constructor(recording) {
        super(recording);
        this.filePath = this.recording.folderPath + "Camera.mp4";
        this.isRecording = false;
        this.recordedData = null;
        this.view = (<RNCamera
            ref={ref => {
                this.camera = ref;
            }}
            style={{
                width: Dimensions.get('window').width - 30,
                height: 200,
                justifyContent: 'space-between',
                padding: 20
            }}
            type="back"
            flashMode="false"
            autoFocus="true"
            zoom={0}
            whiteBalance="auto"
            ratio="16:9"
            androidCameraPermissionOptions={{
                title: 'Permission to use camera',
                message: 'We need your permission to use your camera',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
            }}>

        </RNCamera>);
    }

    /**
     * Created by Chathura Galappaththi
     *
     * Returns the camera view which can be directly rendered
     *
     * @return {*|JSX.Element} The camera view
     */
    getView() {
        return this.view;
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
        return true
    }

    /**
     * Created by Chathura Galappaththi
     *
     * Record from the back camera and save it to file
     *
     * @param mute              True if no audio should be recorded, False otherwise
     * @param quality           The quality of the camera (only a preset of values are allowed)
     * @return {Promise<void>}
     */
    async record(mute = true, quality = "288p") {
        // Wait for the camera to be enabled (only poll every second)
        while (!this.camera) {
            console.log("Camera hasn't been initialised. Trying again...")
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // More options at: https://react-native-camera.github.io/react-native-camera/docs/rncamera#recordasyncoptions-promise
        const options = {
            mute: mute,
            quality: RNCamera.Constants.VideoQuality[quality],
            path: this.filePath
        };

        // Start the recording
        if (!this.isRecording) {
            // Keep trying until the recording has started (this is needed due to the delay in initialising the camera)
            while (!this.recordedData) {
                console.log("Camera: Recording has started...")
                try {
                    // Start the recording and wait
                    this.isRecording = true;
                    this.recordedData = await this.camera.recordAsync(options);
                } catch (error) {
                    console.log(error);
                }
                // Display a message based on whether the recording was started successfully
                console.log(this.recordedData ? "Camera: Recording has stopped" : "Camera: Recording failed! Trying again...");
                this.isRecording = false;
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
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
            // Send the signal to stop recording and wait
            console.log("Camera: Stopping recording...");
            await this.camera.stopRecording();
            while (this.isRecording) {
                await sleep(1);
            }
        }
    }
}

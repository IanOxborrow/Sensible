import Sensor from './Sensor';
import {RNCamera} from "react-native-camera";
import {Dimensions, PermissionsAndroid, Platform} from "react-native";
import React from "react";
import Recorder from "./Recorder";
import {sleep} from "../Utilities";
import {check, PERMISSIONS, RESULTS} from "react-native-permissions";
import {getSensorFileName, SensorType} from "../Sensors";

export default class BackCameraRecorder extends Recorder {
    static sensorWorking = null;
    static permissionsSatisfied = false;

    /**
     * @param recording A reference to the recording class that this recorder is stored under
     */
    constructor(recording) {
        super(recording);
        this.filePath = recording.folderPath + getSensorFileName(SensorType.BACK_CAMERA);
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
                padding: 0
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
     * Requests any permissions required for this sensor
     */
    static async requestPermissions() {
        // request microphone permission
        if (Platform.OS === 'ios') {
            const granted = await check(PERMISSIONS.IOS.CAMERA);
            if (granted == RESULTS.GRANTED) {
                console.log('iOS - You can use the camera');
                BackCameraRecorder.permissionsSatisfied = true;
            }
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Camera Permission',
                        message:
                            'This app needs access to your camera ' +
                            'in order to collect camera data',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('You can use the camera');
                    BackCameraRecorder.permissionsSatisfied = true;
                } else {
                    console.log('Camera permission denied');
                }
            } catch (err) {
                console.warn(err);
            }
        }
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
        BackCameraRecorder.sensorWorking = BackCameraRecorder.permissionsSatisfied;
        return BackCameraRecorder.sensorWorking;
    }

    /**
     * This should be used only where necessary and only if isSensorWorking()
     * has already been called at least once
     *
     * @return {boolean} True if the sensor is working, False otherwise
     */
    static isSensorWorkingSync() {
        if (BackCameraRecorder.sensorWorking == null) {
            console.warn("BackCameraRecorder.sensorWorking: sensor status has not been established");
            return false;
        }

        return BackCameraRecorder.sensorWorking;
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

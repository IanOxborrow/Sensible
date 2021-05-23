/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

/*
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
*/

import React from "react";
import { PermissionsAndroid, Text } from "react-native";
import { SensorType } from "./src/Sensors";
import Recording from "./src/Recording";
import MainStackNavigator from './src/navigation/MainStackNavigator'
import { DocumentDirectoryPath, DownloadDirectoryPath, ExternalDirectoryPath, writeFile } from "react-native-fs";

export default class App extends React.Component
{
    static recording = null;
    static SAVE_FILE_PATH = ExternalDirectoryPath + '/';

    constructor(props)
    {
        super(props);
        this.state = {
            accelerometerData: '',
        };

        App.recording = new Recording();
        App.recording.addSensor(SensorType.ACCELEROMETER);
        App.recording.addSensor(SensorType.GYROSCOPE);
        App.recording.addSensor(SensorType.MAGNETOMETER);
        App.recording.addSensor(SensorType.BAROMETER);
        // App.recording.addSensor(SensorType.MICROPHONE);

        console.log("DocumentDirectoryPath: " + DocumentDirectoryPath);

        const requestStoragePermission = async () => {
            // Get saving permission (Android Only!)
            try
            {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'Storage Permission',
                        message: 'This app needs access to your device in order ' +
                            'to store data',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED)
                {
                    console.log('You can use the device storage');
                    writeFile(App.SAVE_FILE_PATH + "test.txt", 'This is a bit of a gamer move!', 'utf8')
                        .then(() => {
                            console.log('Successfully created ' + App.SAVE_FILE_PATH + "test.txt");
                        }) // TODO: Don't go to any other screen until this has been done
                        .catch(() => {
                            throw new Error(this.constructor.name + '.initialiseGenericSensor: Failed to create sensor file');
                        });
                } else
                {
                    console.log('Storage permission denied');
                }
            } catch (err)
            {
                console.warn(err);
            }
        };
        requestStoragePermission();


        setInterval(function () {
            // console.log(recording.graphableData);
            // console.log(micRecording.graphableData.length);
        }, 100);

        // mic.disable();
    }

    /**
     * Add code for any elements that need to be rendered here
     */
    render()
    {
        return (
            // <Text>{this.state.accelerometerData}</Text>
            <MainStackNavigator />
        );
    }

    /** This is just temporary, reference: https://www.debuggr.io/react-setstate-is-not-a-function/ **/
    updateDisplay()
    {
        let data = this.recording.getSensorData(SensorType.ACCELEROMETER).getLatestSample();
        this.state.accelerometerData = data == null ? 'Loading accelerometer data...' : data.x + ', ' + data.y + ', ' + data.z;
        this.setState({});
    }
}

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
import { Text } from "react-native";
import { SensorType } from "./Sensors";
import Recording from "./Recording";
import MainStackNavigator from './src/navigation/MainStackNavigator'

export default class App extends React.Component
{
    static recording;

    constructor(props)
    {
        super(props);
        this.state = {
            accelerometerData: '',
        };

        /**
         * TODO: Move the below code into the recording.addSensor class is possible.
         * const requestMicPermission = async () => {
         *   try
         *   {
         *     const granted = await PermissionsAndroid.request(
         *       PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
         *       {
         *         title: "Microphone Permission",
         *         message:
         *           "This app needs access to your microphone " +
         *           "in order to collect microphone data",
         *         buttonNeutral: "Ask Me Later",
         *         buttonNegative: "Cancel",
         *         buttonPositive: "OK"
         *       }
         *     );
         *     if (granted === PermissionsAndroid.RESULTS.GRANTED)
         *     {
         *       console.log("You can use the microphone");
         *     } else
         *     {
         *       console.log("Microphone permission denied");
         *     }
         *   } catch (err)
         *   {
         *     console.warn(err);
         *   }
         * };
         */

        App.recording = new Recording();
        App.recording.addSensor(SensorType.ACCELEROMETER);
        // setInterval(() => this.updateDisplay(), 1);

        App.recording.addSensor(SensorType.MICROPHONE);

        /**
         * TODO: Move the below code into the recording.addSensor class.
         * let micRecording = new Recording();
         * let mic = new Mic(micRecording);
         * requestMicPermission();
         * mic.enable();
         */

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

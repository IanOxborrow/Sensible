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



        App.recording = new Recording();
        App.recording.addSensor(SensorType.ACCELEROMETER);
        // setInterval(() => this.updateDisplay(), 1);

        App.recording.addSensor(SensorType.MICROPHONE);


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

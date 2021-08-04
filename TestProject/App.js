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
import { PermissionsAndroid, Platform} from 'react-native';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import { SensorType } from './src/Sensors';
//import Recording from './src/Recording';
import MainStackNavigator from './src/navigation/MainStackNavigator'
import RNFetchBlob from 'rn-fetch-blob';

export default class App extends React.Component
{
    static recording = null;
    static SAVE_FILE_PATH = RNFetchBlob.fs.dirs.DocumentDir + '/';

    constructor(props)
    {
        super(props);
        this.state = {
            accelerometerData: '',
        };

        //check(PERMISSIONS.IOS.STOREKIT)

        const requestStoragePermission = async () => {
            // Get saving permission (Android Only!)
            try {
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
                } else
                {
                    console.log('Storage permission denied');
                }
            } catch (err)
            {
                console.warn(err);
            }
        };

        if (Platform.OS == 'android') {
            requestStoragePermission();
        }
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
        console.log("was called")
        let data = this.recording.getSensorData(SensorType.ACCELEROMETER).getLatestSample();
        this.state.accelerometerData = data == null ? 'Loading accelerometer data...' : data.x + ', ' + data.y + ', ' + data.z;
        this.setState({});
    }
}

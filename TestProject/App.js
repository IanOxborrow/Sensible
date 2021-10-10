/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from "react";
import {NativeModules, PermissionsAndroid, Platform} from 'react-native';
import MainStackNavigator from './src/navigation/MainStackNavigator'
import SplashScreen from 'react-native-splash-screen'
import RecordingManager from "./src/RecordingManager";
import Recording from "./src/Recording";

export default class App extends React.Component {
    constructor(props) {
        super(props);
    }

    /**
     * Request permission to access device storage.
     * Note: This implementation is only for android
     * @return {Promise<void>}
     */
    async requestStoragePermission() {

        //ios does not require permission to write to the file system, so we can return early
        if (Platform.OS == 'ios') {
            return
        }

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

            //check if permission is granted or if the platform is ios. (storge is allowed on ios by default)
            if (granted === PermissionsAndroid.RESULTS.GRANTED || Platform.OS === 'ios') {
                console.log('You can use the device storage');
            } else {
                console.log('Storage permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    };

    /**
     * Perform any initialisation required during the splash screen
     * @return {Promise<void>}
     */
    async init() {
        RecordingManager.RecordingClass = Recording;

        // TODO: Test the above and read from saved file
        await this.requestStoragePermission();
    }

    componentDidMount() {
        this.init().then(() => {
            SplashScreen.hide();
        })
    }

    /**
     * Add code for any elements that need to be rendered here
     */
    render() {
        return (
            <MainStackNavigator/>
        );
    }
}

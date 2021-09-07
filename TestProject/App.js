/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from "react";
import {PermissionsAndroid, Platform} from 'react-native';
import MainStackNavigator from './src/navigation/MainStackNavigator'
import SplashScreen from 'react-native-splash-screen'
import RecordingManager from "./src/RecordingManager";
import Recording from "./src/Recording";

export default class App extends React.Component {
    /**
     * Request permission to access device storage.
     * Note: This implementation is only for android  TODO: Implement this for iOS
     * @return {Promise<void>}
     */
    async requestStoragePermission() {
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
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
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
        await this.requestStoragePermission();
        await RecordingManager.loadRecordings();
    }

    constructor(props) {
        super(props);

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
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('You can use the device storage');
                } else {
                    console.log('Storage permission denied');
                }
            } catch (err) {
                console.warn(err);
            }
        };

        if (Platform.OS === 'android') {
            requestStoragePermission();
        }
    }

    componentDidMount() {
        // TODO: Ask for storage permission whilst on the splash screen
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

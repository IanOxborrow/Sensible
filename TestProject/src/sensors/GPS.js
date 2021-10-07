/* eslint-disable prettier/prettier */
import Sensor from './Sensor';
import { GPSSample } from '../Sensors';
import Geolocation from 'react-native-geolocation-service';
import RecordingManager from "../RecordingManager";
import {PermissionsAndroid, Platform} from "react-native";

export default class GPS extends Sensor
{
    static sensorWorking = null;
    static maxSampleRate = RecordingManager.DEFAULT_MAX_SAMPLE_RATE;
    static minSampleRate = RecordingManager.DEFAULT_MIN_SAMPLE_RATE;
    static sampleRateCalculated = true; // TODO: Change this to false once getMaxSampleRate() has been implemented
    static permissionsSatisfied = false;

    constructor(dataStore, sampleRate)
    {
        super(dataStore, sampleRate);
    }

    /**
     * Push a sample to the most recent SensorTimeframe in the Recording class.
     *
     * @param latitude Sensor Latitude
     * @param longitude Sensor Longitude
     * @param accuracy Sensor Accuracy
     * @param altitude Sensor Altitude
     * @param heading Sensor Heading
     * @param speed Sensor Speed
     * @param timestamp Sensor Timestamp
     */
    pushSample(latitude, longitude, accuracy, altitude, heading, speed, timestamp)
    {
        if (this.isEnabled)
        {
            const latestTimeframe = this.dataStore[this.dataStore.length - 1];
            let sample = new GPSSample(latitude, longitude, accuracy, altitude, heading, speed, timestamp);
            latestTimeframe.addSample(sample);
        }
    }

    /**
     * Requests any permissions required for this sensor
     */
    static async requestPermissions() {
        // request GPS permission
        if (Platform.OS == 'ios') {
            const authorisation = await Geolocation.requestAuthorization("whenInUse");
            console.log('Im here!')
            if (authorisation == 'granted' || authorisation == 'restricted') {
                console.log('iOS - You can use the GPS');
                GPS.permissionsSatisfied = true;
            } else {
                console.log('iOS - GPS permission not granted');
                console.log(authorisation);
                // TODO: Stop the initialisation if permission is denied
            }
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Permission',
                        message:
                            'This app needs access to your location ' +
                            'in order to collect location data',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('You can use the GPS');
                    GPS.permissionsSatisfied = true;
                } else {
                    console.log('GPS permission denied');
                    // TODO: Stop the initialisation if permission is denied
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
        return GPS.permissionsSatisfied;
    }

    /**
     * Created by ?
     *
     * Tests the maximum possible sample rate
     *
     * @return {Promise<number>} The maximum sampling rate
     */
    static async getMaxSampleRate() {
        if (!await GPS.isSensorWorking()) {
            return -1;
        }

        return 200;
    }

    /**
     * Enable the GPS
     */
    enable()
    {
        if (!this.isEnabled)
        {
            if (this.sampleRate === 0)
            {
                throw new Error(this.constructor.name + '.enable: Received an invalid sample rate of ' + this.sampleRate +
                    '. Sample rates must be strictly positive');
            }

            this.isEnabled = true;
            this.subscription = setInterval(() => {this.getSample()}, this.sampleRate)
            this.updateSampleRate(this.sampleRate);
        }
        else {throw new Error(this.constructor.name + '.enable: Sensor is already enabled!');}
    }

    /***
     * Disable the gyroscope
     */
    disable()
    {
        if (this.isEnabled)
        {
            this.isEnabled = false;
            clearTimeout(this.subscription);
        }
        else
        {
            throw new Error(this.constructor.name + '.disable: Sensor is already disabled!');
        }
    }

    /***
     * Update the sampling rate (the sensor must already be enabled for this function to be effective).
     * @param sampleRate The new rate at which the gyroscope data should be sampled (in Hz)
     */
    updateSampleRate(sampleRate)
    {
        // Check that no invalid values are passed in
        if (sampleRate < 0)
        {
            throw new Error(this.constructor.name + '.updateSampleRate: Received an invalid sample rate of ' +
                sampleRate + '. Sample rates must be positive');
        }
        else if (!this.isEnabled)
        {
            throw new Error(this.constructor.name + '.updateSampleRate: Cannot update sample rate whilst the ' +
              'sensor is disabled');
        }

        this.sampleRate = sampleRate;
    }

    /***
    * Get a sample from the GPS sensor
    *
    */
    getSample() {
        Geolocation.getCurrentPosition(
           (position) => {
             // position comes back as object with
             this.pushSample(position.coords.latitude,
                             position.coords.longitude,
                             position.coords.accuracy,
                             position.coords.altitude,
                             position.coords.heading,
                             position.coords.speed,
                             position.timestamp);
           },
           (error) => {
             // See error code charts below.
             //console.log(error.code, error.message);
           },
           { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }
}

/* eslint-disable prettier/prettier */
import Sensor from './Sensor';
import { BarometerSample } from '../Sensors';
import {barometer} from 'react-native-sensors';
import { sleep } from "../Utilities";
import RecordingManager from "../RecordingManager";

export default class Barometer extends Sensor
{
    static sensorWorking = null;
    static maxSampleRate = RecordingManager.DEFAULT_MAX_SAMPLE_RATE;
    static minSampleRate = RecordingManager.DEFAULT_MIN_SAMPLE_RATE;
    static sampleRateCalculated = false;
    static permissionsSatisfied = false;

    constructor(dataStore, sampleRate)
    {
        super(dataStore, sampleRate);
    }

    /**
     * Push a sample to the most recent SensorTimeframe in the Recording class. This function should only be
     * called by the react-native-sensors module which provides data from the barometer
     *
     * @param pressure Atmospheric pressure
     */
    pushSample(pressure)
    {
        if (this.isEnabled)
        {
            const latestTimeframe = this.dataStore[this.dataStore.length - 1];
            const sample = new BarometerSample(pressure);
            latestTimeframe.addSample(sample);
        }
    }

    /**
     * Requests any permissions required for this sensor
     */
    static async requestPermissions() {
        Barometer.permissionsSatisfied = true;
    }

    /**
     * Created by Chathura Galappaththi
     *
     * Checks whether the sensor is able to be used
     *
     * @return {Promise<boolean>} True if the sensor is working, False otherwise
     */
    static async isSensorWorking() {
        if (!Barometer.permissionsSatisfied) {
            return false;
        } else if (Barometer.sensorWorking != null) {
            return Barometer.sensorWorking;
        }

        const subscription = await barometer.subscribe({
            next: () => {
                Barometer.sensorWorking = true;
            },
            error: () => {
                Barometer.sensorWorking = false;
                Barometer.sampleRateCalculated = true;
            }
        });

        while (Barometer.sensorWorking == null) {
            await sleep(1);
        }
        subscription.unsubscribe();

        return Barometer.sensorWorking;
    }

    /**
     * Created by Chathura Galappaththi
     *
     * Tests the maximum possible sample rate (requires ~3min to run)
     *
     * @return {Promise<number>} The maximum sampling rate
     */
    static async getMaxSampleRate() {
        if (!await Barometer.isSensorWorking()) {
            return -1;
        }

        return Barometer.maxSampleRate;
    }

    /**
     * Enable the barometer
     */
    enable()
    {
        console.warn(this.constructor.name + '.enable: A sample rate cannot be set for the barometer');

        if (!this.isEnabled)
        {
            if (this.sampleRate === 0)
            {
                throw new Error(this.constructor.name + '.enable: Received an invalid sample rate of ' + this.sampleRate +
                    '. Sample rates must be strictly positive');
            }

            this.isEnabled = true;
            let samples = 0;
            let start = null;
            let duration = 0;
            this.subscription = barometer.subscribe(({ pressure, timestamp }) => {
                this.pushSample(pressure);

                // Calculate the max sample rate if it is currently using the default
                if (RecordingManager.sampleRatesCalculated === 0 && !Barometer.sampleRateCalculated) {
                    if (start == null) {
                        start = timestamp;
                    }

                    samples++;
                    duration = (timestamp - start)/1000;
                    if (duration >= 3*60) {
                        Barometer.maxSampleRate = samples/duration;
                        Barometer.sampleRateCalculated = true;
                        RecordingManager.saveConfig();
                    }
                }
            });
        }
        else {throw new Error(this.constructor.name + '.enable: Sensor is already enabled!');}
    }

    /***
     * Disable the barometer
     */
    disable()
    {
        if (this.isEnabled)
        {
            this.isEnabled = false;
            this.subscription.unsubscribe();
        }
        else
        {
            throw new Error(this.constructor.name + '.disable: Sensor is already disabled!');
        }
    }

    /***
     * Update the sampling rate (the sensor must already be enabled for this function to be effective).
     * @param sampleRate The new rate at which the barometer data should be sampled (in Hz)
     */
    updateSampleRate(sampleRate)
    {
        throw new Error(this.constructor.name + '.updateSampleRate: A custom sampling rate cannot be set for the ' +
            'barometer');
    }
}

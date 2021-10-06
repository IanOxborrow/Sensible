/* eslint-disable prettier/prettier */
import Sensor from './Sensor';
import { BarometerSample } from '../Sensors';
import {barometer, setUpdateIntervalForType, SensorTypes, accelerometer} from 'react-native-sensors';
import { sleep } from "../Utilities";

export default class Barometer extends Sensor
{
    static sensorWorking = null;
    static maxSampleRate = -1;

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
     * Created by Chathura Galappaththi
     *
     * Checks whether the sensor is able to be used
     *
     * @return {Promise<boolean>} True if the sensor is working, False otherwise
     */
    static async isSensorWorking() {
        if (Barometer.sensorWorking != null) {
            return Barometer.sensorWorking;
        }

        const subscription = await barometer.subscribe({
            next: () => {
                Barometer.sensorWorking = true;
            },
            error: () => {
                Barometer.sensorWorking = false;
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
        else if (Barometer.maxSampleRate > -1) {
            return Barometer.maxSampleRate;
        }

        let testing = true;
        let samples = 0
        let start = null;
        let duration = 0;
        const subscription = await barometer.subscribe(({x, y, z, timestamp}) => {
            if (start == null) {
                start = timestamp;
            }

            samples++;
            duration = (timestamp - start)/1000
            if (duration >= 3*60) {
                subscription.unsubscribe();
                testing = false
            }
        });

        while (testing) {
            await sleep(1);
        }

        Barometer.maxSampleRate = samples/duration
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

            this.subscription = barometer.subscribe(({ pressure, timestamp }) => this.pushSample(pressure));
            this.isEnabled = true;
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

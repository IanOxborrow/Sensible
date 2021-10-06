/* eslint-disable prettier/prettier */
import Sensor from './Sensor';
import { AccelerometerSample } from '../Sensors';
import {accelerometer, setUpdateIntervalForType, SensorTypes} from 'react-native-sensors';
import {sleep} from "../Utilities";
import RecordingManager from "../RecordingManager";

export default class Accelerometer extends Sensor
{
    static sensorWorking = null;
    static maxSampleRate = RecordingManager.DEFAULT_MAX_SAMPLE_RATE;
    static minSampleRate = RecordingManager.DEFAULT_MIN_SAMPLE_RATE;
    static sampleRateCalculated = false;

    constructor(dataStore, sampleRate)
    {
        super(dataStore, sampleRate);
    }

    /**
     * Push a sample to the most recent SensorTimeframe in the Recording class. This function should only be
     * called by the react-native-sensors module which provides data from the accelerometer
     *
     * @param x Acceleration in the x axis
     * @param y Acceleration in the y axis
     * @param z Acceleration in the z axis
     */
    pushSample(x, y, z)
    {
        if (this.isEnabled)
        {
            const latestTimeframe = this.dataStore[this.dataStore.length - 1];
            const sample = new AccelerometerSample(x, y, z);
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
        if (Accelerometer.sensorWorking != null) {
            return Accelerometer.sensorWorking;
        }

        const subscription = await accelerometer.subscribe({
            next: () => {
                Accelerometer.sensorWorking = true;
            },
            error: () => {
                Accelerometer.sensorWorking = false;
                Accelerometer.sampleRateCalculated = true;
            }
        });

        while (Accelerometer.sensorWorking == null) {
            await sleep(1);
        }
        subscription.unsubscribe();

        return Accelerometer.sensorWorking;
    }

    /**
     * Created by Chathura Galappaththi
     *
     * Tests the maximum possible sample rate (requires ~3min to run)
     *
     * @return {Promise<number>} The maximum sampling rate
     */
    static async getMaxSampleRate() {
        if (!await Accelerometer.isSensorWorking()) {
            return -1;
        }

        return Accelerometer.maxSampleRate;
    }

    /**
     * Enable the accelerometer
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
            let samples = 0;
            let start = null;
            let duration = 0;
            this.subscription = accelerometer.subscribe(({ x, y, z, timestamp }) => {
                this.pushSample(x, y, z);

                // Calculate the max sample rate if it is currently using the default
                if (RecordingManager.sampleRatesCalculated === 0 && !Accelerometer.sampleRateCalculated) {
                    if (start == null) {
                        start = timestamp;
                    }

                    samples++;
                    duration = (timestamp - start)/1000;
                    if (duration >= 3*60) {
                        Accelerometer.maxSampleRate = samples/duration;
                        Accelerometer.sampleRateCalculated = true;
                        RecordingManager.saveConfig();
                    }
                }
            });
            this.updateSampleRate(this.sampleRate);
        }
        else {throw new Error(this.constructor.name + '.enable: Sensor is already enabled!');}
    }

    /***
     * Disable the accelerometer
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
     * @param sampleRate The new rate at which the accelerometer data should be sampled (in Hz)
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
        setUpdateIntervalForType(SensorTypes.accelerometer, this.frequencyToPeriod(this.sampleRate) * 1000);
    }
}

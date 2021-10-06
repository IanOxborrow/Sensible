/* eslint-disable prettier/prettier */
import Sensor from './Sensor';
import { GyroscopeSample } from '../Sensors';
import {gyroscope, setUpdateIntervalForType, SensorTypes, accelerometer} from 'react-native-sensors';
import {sleep} from "../Utilities";

export default class Gyroscope extends Sensor
{
    static sensorWorking = null;
    static maxSampleRate = -1;

    constructor(dataStore, sampleRate)
    {
        super(dataStore, sampleRate);
    }

    /**
     * Push a sample to the most recent SensorTimeframe in the Recording class. This function should only be
     * called by the react-native-sensors module which provides data from the gyroscope
     *
     * @param x Angular velocity in the x axis
     * @param y Angular velocity in the y axis
     * @param z Angular velocity in the z axis
     */
    pushSample(x, y, z)
    {
        if (this.isEnabled)
        {
            const latestTimeframe = this.dataStore[this.dataStore.length - 1];
            const sample = new GyroscopeSample(x, y, z);
            latestTimeframe.addSample(sample);
        }
    }

    /**
     * Created by Chathura Galappaththi
     *
     * Checks whether the sensor is able to be used
     *
     * @return True if the sensor is working, False otherwise
     */
    static async isSensorWorking() {
        if (Gyroscope.sensorWorking != null) {
            return Gyroscope.sensorWorking;
        }

        const subscription = await gyroscope.subscribe({
            next: () => {
                Gyroscope.sensorWorking = true;
            },
            error: () => {
                Gyroscope.sensorWorking = false;
            }
        });

        while (Gyroscope.sensorWorking == null) {
            await sleep(1);
        }
        subscription.unsubscribe();

        return Gyroscope.sensorWorking;
    }

    /**
     * Created by Chathura Galappaththi
     *
     * Tests the maximum possible sample rate (requires ~3min to run)
     *
     * @return {Promise<number>} The maximum sampling rate
     */
    static async getMaxSampleRate() {
        if (!await Gyroscope.isSensorWorking()) {
            return -1;
        }
        else if (Gyroscope.maxSampleRate > -1) {
            return Gyroscope.maxSampleRate;
        }

        let testing = true;
        let samples = 0
        let start = null;
        let duration = 0;
        const subscription = await gyroscope.subscribe(({x, y, z, timestamp}) => {
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

        Gyroscope.maxSampleRate = samples/duration
        return Gyroscope.maxSampleRate;
    }

    /**
     * Enable the gyroscope
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
            this.subscription = gyroscope.subscribe(({ x, y, z, timestamp }) => this.pushSample(x, y, z));
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
            this.subscription.unsubscribe();
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
        setUpdateIntervalForType(SensorTypes.gyroscope, this.frequencyToPeriod(this.sampleRate) * 1000);
    }
}

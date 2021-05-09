/* eslint-disable prettier/prettier */
import Sensor from './Sensor';
import { GyroscopeSample } from '../Sensors';
import { gyroscope, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';

export default class Gyroscope extends Sensor
{
    constructor(dataStore, sampleRate = null)
    {
        super(dataStore);
        gyroscope.subscribe(({ x, y, z, timestamp }) => this.pushSample(x, y, z));
        // Enable the sensor if the parameter has been passed in
        if (sampleRate != null)
        {
            this.enable(sampleRate);
        }
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
     * Enable the gyroscope
     * @param sampleRate The rate at which gyroscope data should be sampled
     */
    enable(sampleRate)
    {
        if (!this.isEnabled)
        {
            if (sampleRate === 0)
            {
                throw new Error(this.constructor.name + '.enable: Received an invalid sample rate of ' + sampleRate +
                    '. Sample rates must be strictly positive');
            }

            this.isEnabled = true;
            this.updateSampleRate(sampleRate);
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
            this.updateSampleRate(0);
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

        setUpdateIntervalForType(SensorTypes.gyroscope, this.frequencyToPeriod(sampleRate) * 1000);
    }
}

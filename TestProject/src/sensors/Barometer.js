/* eslint-disable prettier/prettier */
import Sensor from './Sensor';
import { BarometerSample } from '../Sensors';
import { barometer, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';

export default class Barometer extends Sensor
{
    constructor(dataStore, sampleRate = null)
    {
        super(dataStore);
        // Enable the sensor if the parameter has been passed in
        if (sampleRate != null)
        {
            this.enable(sampleRate);
        }
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
     * Enable the barometer
     * @param sampleRate The rate at which barometer data should be sampled
     */
    enable(sampleRate)
    {
        console.warn(this.constructor.name + '.enable: A sample rate cannot be set for the barometer');

        if (!this.isEnabled)
        {
            if (sampleRate === 0)
            {
                throw new Error(this.constructor.name + '.enable: Received an invalid sample rate of ' + sampleRate +
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

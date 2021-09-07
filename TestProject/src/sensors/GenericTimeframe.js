/* eslint-disable prettier/prettier */
import SensorTimeframe from './SensorTimeframe';
import SensorSample from './SensorSample';
import { getSensorFileName, getSensorClass, SensorType } from "../Sensors";
import {NativeModules, Platform} from 'react-native';

const { ofstream } = NativeModules;

export default class GenericTimeframe extends SensorTimeframe
{
    /**
     * @param recording     A reference to the recording class that this timeframe is stored under
     * @param initialSize   The number of samples to store before auto-saving to file
     * @param bufferSize    The number of samples to push to file at once
     * @param type          The type of data stored in the timeframe eg. SensorTypes.ACCELEROMETER
     * @param label         The initial label of the current timeframe (optional)
     */
    constructor(recording, initialSize, bufferSize, type, label = null)
    {
        super(recording, initialSize, bufferSize);
        this.type = type;
        this.label = label;
        this.latestSample = null;
        this.filePath = this.recording.folderPath + getSensorFileName(this.type);
    }

    /**
     * Add a sample to the current timeframe. This should only be called on the latest timeframe.
     *
     * @param sample The sample to add to the timeframe
     */
    addSample(sample)
    {
        this.latestSample = sample;
        this.save(this.latestSample);
    }

    /**
     * Add multiple samples to the timeframe at once. This should only be called on the latest timeframe.
     * @param samples An array of samples to add to the timeframe
     * @param wrapper A reference to a wrapper class (eg. MicSample, AccelerometerSample). This is only needed
     *                if the data is not pre-wrapped in a Sample class
     */
    addSamples(samples, wrapper = null)
    {
        // Make sure that the data is wrapped in a sample class
        if (!(samples[0] instanceof SensorSample) && wrapper == null)
        {
            throw new Error(this.constructor.name + '.addSamples: Received an unwrapped sample with no reference to ' +
                'a wrapper. Either pass in wrapped data or pass in a reference to the wrapper class.');
        }

        for (let i = 0; i < samples.length; i++)
        {
            const sample = wrapper == null ? samples[i] : new wrapper(samples[i]);
            // Wrap the sample if needed and add it to this timeframe
            this.addSample(sample);
        }
    }

    /**
     * Save the given sample to a csv file
     * @param sample The sample to save to the file
     */
    save(sample)
    {
        if (this.type === SensorType.MICROPHONE) {
            return;
        }

        // TODO: Make this platform independent!
        if (Platform.OS !== 'ios') {
            ofstream.write(this.recording.fileStreamIndices[this.type], sample.getData().toString() + ',' + this.label + '\n');
        }
    }

    /**
     * Get the latest sample from this timeframe
     * @returns The latest sample stored in the timeframe
     */
    getLatestSample()
    {
        return this.latestSample;
    }
}

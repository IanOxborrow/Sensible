/* eslint-disable prettier/prettier */
import SensorTimeframe from './SensorTimeframe';
import SensorSample from './SensorSample';
import { getSensorFileName, getSensorClass, SensorType } from "../Sensors";
import {NativeModules} from "react-native";

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
        this.filePath = this.recording.folderPath + getSensorFileName(this.type);
    }

    /**
     * Calculates the new index of a circular pointer after moving it n spaces
     *
     * @param shiftCount   How many indices to shift the pointer (use negatives to shift left)
     * @param currentIndex The current index of the pointer
     * @param elementCount The number of elements currently in the array
     * @param size         The size of the physical array (not the number of elements currently in the array)
     * @return The new index of the pointer
     */
    static moveCircularPointer(shiftCount, currentIndex, elementCount, size)
    {
        if (Math.abs(shiftCount) > elementCount)
        {
            throw new Error('GenericTimeframe.moveCircularPointer: Attempted to shift the pointer ' + shiftCount +
                ' space(s) but the array is only ' + elementCount + ' element(s) long');
        }

        if (shiftCount > 0)
        {
            return currentIndex + shiftCount < size ? currentIndex + shiftCount : currentIndex + shiftCount - size;
        }
        else
        {
            return currentIndex + shiftCount > -1 ? currentIndex + shiftCount : currentIndex + shiftCount + size;
        }
    }

    /**
     * Add a sample to the current timeframe. This should only be called on the latest timeframe.
     *
     * @param sample The sample to add to the timeframe
     */
    addSample(sample)
    {
        // Make sure that the data is wrapped in a sample class
        if (!(sample instanceof SensorSample))
        {
            throw new Error(this.constructor.name + '.addSample: Received an unwrapped sample.');
        }

        // Pop the first sample and shift the array if at capacity
        if (this.dataSize === this.data.length) {this.popAndSave(1);} // TODO: Modify the popAndSave function to only pop (we save each point as we go)
        // Write the new sample to file
        const label = this.label == null ? null : this.label.name;
        ofstream.write(this.recording.fileStreamIndices[this.type], sample.getData().toString() + ',' + label + '\n');

        // Add the sample
        this.data[this.dataPointer] = sample;
        // Move the pointer and increment the size
        this.dataSize++;
        this.dataPointer = GenericTimeframe.moveCircularPointer(1, this.dataPointer, this.dataSize, this.data.length);
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

    /***
     * Removes the first n samples from the data array and saves it
     * @param sampleCount The first n samples to save
     */
    popAndSave(sampleCount)
    {
        if (sampleCount > this.dataSize)
        {throw new Error('GenericTimeframe.popAndSave: Attempted to pop and save ' + sampleCount +
            ' samples but there were only ' + this.dataSize);}

        // Run a function on the first n elements of the data array (used later)
        const runFirstN = (n, func) => {
            for (let i = n - 1; i >= 0; i--)
            {
                let dataIndex = GenericTimeframe.moveCircularPointer(-this.dataSize + i,
                    this.dataPointer, this.dataSize, this.data.length);
                func(dataIndex);
            }
        };

        // If only a section of the timeframe is being saved and this section can fit in the buffer, just add it to
        // the buffer without actually saving it to a file
        if (sampleCount < this.dataSize && sampleCount <= this.exportBuffer.length - this.bufferSize)
        {
            // Copy the samples to the buffer
            runFirstN(sampleCount, (index) => {
                this.exportBuffer[this.bufferSize] = this.data[index];
                this.bufferSize++;
            });
        }
        // Otherwise save the buffer and the samples at once
        else
        {
            // Create a copy of the export buffer
            let output = this.exportBuffer.slice();
            let newDataIndex = output.length;
            // Increase the size of the buffer to accommodate of the extra samples from the data array
            output[output.length + sampleCount - 1] = null;
            // Copy the samples from the data array to the output array
            runFirstN(sampleCount, (index) => {
                output[newDataIndex] = this.data[index];
                newDataIndex++;
            });
            // Reset the buffer
            this.bufferSize = 0;
            // Save the resulting data
            this.saveToCsv(output);
        }
        // Decrease the size
        this.dataSize -= sampleCount;
    }

    /**
     * Save the given samples to a csv file
     * @param samples The samples to save to the file
     */
    saveToCsv(samples)
    {
        // TODO: Remove this
        // if (this.type == SensorType.MICROPHONE)
        // {
        //     return;
        // }
        //
        // if (this.recording.writeStreams[this.type] == null)
        // {
        //     // console.log('File stream already closed, ignoring buffer flush.');
        //     return; // TODO: Remove this
        //     // throw Error('GenericTimeframe.saveToCsv: Failed to obtain the correct write stream');
        // }
        //
        // for (let i = 0; i < samples.length; i++)
        // {
        //     const label = this.label == null ? null : this.label.name;
        //     this.recording.writeStreams[this.type].write(samples[i].getData().toString() + ',' + label + '\n');
        // }
        // console.log('Buffer for ' + getSensorClass(this.type).prototype.constructor.name + ' pushed');
    }

    /**
     * Get the latest sample from this timeframe
     * @returns The latest sample stored in the timeframe
     */
    getLatestSample()
    {
        return this.dataSize === 0 ? null : this.data[GenericTimeframe.moveCircularPointer(-1, this.dataPointer, this.dataSize, this.data.length)];
    }
}

/* eslint-disable prettier/prettier */
import SensorTimeframe from './SensorTimeframe';

export default class GenericTimeframe extends SensorTimeframe
{
    /**
     * @param initialSize The maximum number of data points stored in the timeframe. This should be the same as the number
     *                    of data points shown in the graph.
     * @param bufferSize The number of samples to store before it is saved to the file all at once. This is used to
     *                   prevent samples being saved one at a time which adds a lot of extra overhead
     */
    constructor(initialSize, bufferSize)
    {
        super(initialSize, bufferSize);
        this.warning = false; // TODO: Remove this later, it is only used to prevent the saveToCsv function from throwing a warning repeatedly
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
            {throw new Error('GenericTimeframe.moveCircularPointer: Attempted to shift the pointer ' + shiftCount +
              ' space(s) but the array is only ' + elementCount + ' element(s) long');}

        if (shiftCount > 0)
            {return currentIndex + shiftCount < size ? currentIndex + shiftCount : currentIndex + shiftCount - size;}
        else
            {return currentIndex + shiftCount > -1 ? currentIndex + shiftCount : currentIndex + shiftCount + size;}
    }

    /**
     * Add a sample to the current timeframe. This should only be called on the latest timeframe.
     *
     * @param sample The sample to add
     */
    addSample(sample)
    {
        // Pop the first sample and shift the array if at capacity
        if (this.dataSize === this.data.length) {this.popAndSave(1);}

        // Add the sample
        this.data[this.dataPointer] = sample;
        // Move the pointer and increment the size
        this.dataSize++;
        this.dataPointer = GenericTimeframe.moveCircularPointer(1, this.dataPointer, this.dataSize, this.data.length);
        // For now update the last sample
        // else this.data[this.data.length - 1] = sample;
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
        if (!this.warning)
        {
            console.warn('GenericTimeframe.saveToCsv: Method has not been implemented. No data will be saved.');
            this.warning = true;
        }
    }

    /**
     * Get the latest sample from this timeframe
     * @returns The latest sample stored in the timeframe
     */
    getLatestSample()
    {
        return this.size === 0 ? null : this.data[this.dataSize - 1];
    }
}

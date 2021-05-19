/* eslint-disable prettier/prettier */
import { ErrorChecking } from '../Errors';
import Recording from "../Recording";

export default class SensorTimeframe
{
    /**
     * Initialise everything
     *
     * @param recording     A reference to the recording class that this timeframe is stored under
     * @param initialSize   The number of samples to store before auto-saving to file
     * @param bufferSize    The number of samples to push to file at once
     */
    constructor(recording, initialSize, bufferSize)
    {
        // Make sure the correct parameters are passed in
        if (!(recording instanceof Recording))
        {
            throw new Error('SensorTimeframe.constructor(): A valid reference to the recording instance must be passed in.');
        }
        else if (!Number.isInteger(initialSize) || initialSize < 1)
        {
            throw new Error('SensorTimeframe.constructor(): A valid initial storage size must be specified.');
        }
        else if (!Number.isInteger(bufferSize) || bufferSize < 1)
        {
            throw new Error('SensorTimeframe.constructor(): A valid buffer size size must be specified.');
        }

        this.data = new Array(initialSize);
        this.dataSize = 0;
        this.dataPointer = 0;
        this.exportBuffer = new Array(bufferSize);
        this.bufferSize = 0; // The number of elements actually in the buffer
        this.recording = recording;

        /*** Everything below this is for checking that child classes implement functions correctly */
        // Only run the checks if we're allowed to
        if (!ErrorChecking.ALLOW_IMPLEMENTATION_CHECKS) { return; }

        // Prevent this class from being instantiated
        if (this.constructor === SensorTimeframe)
        {
            throw new Error(this.constructor.name + ' interface cannot be instantiated');
        }
        // Make sure all required methods are implemented in child classes
        else
        {
            // Get the interface implementation class
            const child = Object.getPrototypeOf(this);
            // A list of functions that needs to be implemented
            let functions = [
                {name: 'constructor', params: ['recording', 'initialSize', 'bufferSize']},
                {name: 'addSample', params: ['sample']},
                {name: 'popAndSave', params: ['sampleCount']},
                {name: 'saveToCsv', params: ['samples']},
            ];
            // Check that the interface has been implemented correctly
            ErrorChecking.checkInterfaceImplementation(functions, child);
        }

    }
}

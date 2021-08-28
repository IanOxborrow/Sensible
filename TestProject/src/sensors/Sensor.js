/* eslint-disable prettier/prettier */
import { ErrorChecking } from '../Errors';

export default class Sensor
{
    constructor(dataStore)
    {
        this.isEnabled = false;
        this.dataStore = dataStore;

        /*** Everything below this is for checking that child classes implement functions correctly */
        // // Only run the checks if we're allowed to
        // if (!ErrorChecking.ALLOW_IMPLEMENTATION_CHECKS) { return; }
        //
        // // Prevent this class from being instantiated
        // if (this.constructor === Sensor)
        // {
        //     throw new Error(this.constructor.name + ' interface cannot be instantiated');
        // }
        // // Make sure all required methods are implemented in child classes
        // else
        // {
        //     // Get the interface implementation class
        //     const child = Object.getPrototypeOf(this);
        //     // A list of functions that needs to be implemented
        //     let functions = [
        //         {name: 'constructor', params: ['dataStore']},
        //         {name: 'enable', params: ['sampleRate']},
        //         {name: 'disable', params: []},
        //         {name: 'updateSampleRate', params: ['sampleRate']},
        //     ];
        //     // Check that the interface has been implemented correctly
        //     ErrorChecking.checkInterfaceImplementation(functions, child);
        // }
    }

    /**
     * Convert a frequency value (in Hz) to a period value (in s)
     * @param frequency
     * @return The period value of the given frequency value
     */
    frequencyToPeriod(frequency)
    {
        return 1 / frequency;
    }
}

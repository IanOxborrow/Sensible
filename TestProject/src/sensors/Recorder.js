/* eslint-disable prettier/prettier */
import { ErrorChecking } from '../Errors';
import {getSensorFileName} from "../Sensors";

export default class Recorder
{
    /**
     * Initialise everything
     *
     * @param recording A reference to the recording class that this recorder is stored under
     */
    constructor(recording)
    {
        this.recording = recording;

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
        //         {name: 'constructor', params: ['recording']},
        //     ];
        //     // Check that the interface has been implemented correctly
        //     ErrorChecking.checkInterfaceImplementation(functions, child);
        // }
    }
}

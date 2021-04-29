/* eslint-disable prettier/prettier */
import { ErrorChecking } from '../Errors';

export default class SensorSample
{
    constructor()
    {
        /*** Everything below this is for checking that child classes implement functions correctly */
        // Only run the checks if we're allowed to
        if (!ErrorChecking.ALLOW_IMPLEMENTATION_CHECKS) { return; }

        // Prevent this class from being instantiated
        if (this.constructor === SensorSample)
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
                {name: 'getComponents', params: []},
                {name: 'getData', params: []},
            ];
            // Check that the interface has been implemented correctly
            ErrorChecking.checkInterfaceImplementation(functions, child);
        }
    }

}

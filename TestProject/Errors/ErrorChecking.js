import NotImplementedError from "./NotImplementedError"
import InconsistentParametersError from "./InconsistentParametersError"

export default class ErrorChecking
{
    static checkedImplementations = {};

    /**
     * Returns the parameter names of a given function
     *
     * @param func The function to take the parameter names from. Make sure to pass the function in without the
     *             brackets ie. use `getParameterNames(testFunc)` rather than `getParameterNames(testFunc())`
     * @returns An array of parameter names of the function
     */
    static getParameterNames(func)
    {
        /* Credit to:
         * Allan, J., 2012. How to get function parameter names/values dynamically?.
         * [Source Code] Stack Overflow, Available at: <https://stackoverflow.com/a/9924463> [Accessed 7 April 2021].
         */
        const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
        const ARGUMENT_NAMES = /([^\s,]+)/g;
        const fnStr = func.toString().replace(STRIP_COMMENTS, '');
        let result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
        if (result === null)
            result = [];
        return result;
    }

    /**
     * Check that a class has implemented an interface correctly, that is ensure that the function
     * signatures match the interface
     *
     * IMPORTANT: This does not check the types of the parameters, only that the parameter names match
     *            up and that the functions have been implemented
     *
     * @param functions               The functions that the interface requires
     * @param interfaceImplementation The class that has implemented the desired interface
     */
    static checkInterfaceImplementation(functions, interfaceImplementation)
    {
        /**
         * For some reason, everything is run a second time when an error is thrown. This is not a problem as
         * this only happens when an error is actually thrown (I've tested with standard Error and the custom
         * InconsistentParametersError)
         */

        // Only run the checks if we're allowed to and it hasn't already been checked
        const interfaceName = interfaceImplementation.constructor.name;
        if (!ErrorChecking.ALLOW_IMPLEMENTATION_CHECKS || interfaceName in this.checkedImplementations)
            return;
        console.log("Performing interface implementation checks for class " + interfaceName);

        this.checkedImplementations[interfaceName] = true;
        functions.forEach((f) => {
            if (!interfaceImplementation.hasOwnProperty(f.name))
                throw new NotImplementedError(f.name + "(" + f.params + ") of " +
                  interfaceName + " has not been implemented");
            else
            {
                const expected = f.params;
                const got = ErrorChecking.getParameterNames(interfaceImplementation[f.name]);
                const errorMessage = "Expected " + interfaceName + "." + f.name + "(" + expected + ") but got " +
                  interfaceName + "." + f.name + "(" + got + ")";

                // Do a simple check of the number of parameters
                if (expected.length !== got.length)
                    throw new InconsistentParametersError(errorMessage);
                // Otherwise check that each parameter name matches that of the interface
                else
                {
                    for (let i = 0; i < expected.length; i++)
                    {
                        if (expected[i] !== got[i])
                            throw new InconsistentParametersError(errorMessage + ". Namely, " + got[i] +
                                " should be " + expected[i]);
                    }
                }
            }
        });

        console.log("Completed interface implementation checks for class " + interfaceName);
    }
}

// The ALLOW_IMPLEMENTATION_CHECKS value, change this for the production run
Object.defineProperty(ErrorChecking, 'ALLOW_IMPLEMENTATION_CHECKS', {
    value: true,
    writable : false,
    enumerable : true,
    configurable : false
});

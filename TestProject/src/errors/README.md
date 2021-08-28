The classes in this directory are for error checking purposes. This includes custom error classes to improve readability
as well as classes for error checking purposes such as ensuring an interface has been implemented correctly.

# Interfaces
JavaScript does not have native support for interfaces however the `checkInterfaceImplementation` of `ErrorChecking.js` 
has been developed to ensure that interfaces are implemented correctly and to allow for early error detection. It is
important to note however that this function merely checks that the required functions have been implemented and that
parameter names match that of the interface. It does NOT check the types of the parameters however a difference in
variable is a good indicator of a type error.

### Using `checkInterfaceImplementation`
To use the `checkInterfaceImplementation` function, simply import it from the `Errors` module. This involves adding the
following to your code:
```
import { ErrorChecking } from "./Errors"
```
> If the file from which you are attempting to access the `Errors` module is not in the root directory, you will
> have to modify the path. For example, if your class was in `/Category/Classes/Class.js` where `/` is the root
> directory, you would have to use `"../../Errors"` instead of `"./Errors"` to return to the root directory.

Once imported, pass in an array of JavaScript objects with the `name` and `params` of each function along with a
prototype reference to the implementation class, and the function will do the rest. An example can be seen below:
```
import { ErrorChecking } from "../Errors"

class Interface
{
    constructor()
    {
        /*** Everything below this is for checking that child classes implement functions correctly */
        // Only run the checks if we're allowed to
        if (!ErrorChecking.ALLOW_IMPLEMENTATION_CHECKS) return;
        
        // Prevent this class from being instantiated
        if (this.constructor === Interface)
        {
            throw new Error(this.constructor.name + " interface cannot be instantiated");
        }
        // Make sure all required methods are implemented in child classes
        else
        {
            // Get the interface implementation class
            const child = Object.getPrototypeOf(this);
            // A list of functions that needs to be implemented
            let functions = [
                {name: "func1", params: []},
                {name: "func2", params: ["param1", "param2"]}
            ];
            // Check that the interface has been implemented correctly
            ErrorChecking.checkInterfaceImplementation(functions, child);
        }
    }
}
```

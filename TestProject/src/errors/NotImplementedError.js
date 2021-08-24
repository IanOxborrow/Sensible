/* eslint-disable prettier/prettier */
export default class NotImplementedError extends Error
{
    constructor(message)
    {
        super(message);
        this.name = "NotImplementedError";
    }
}

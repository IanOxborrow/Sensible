/* eslint-disable prettier/prettier */
export default class Label
{
    constructor(name, startTime = null)
    {
        this.name = name;
        this.startTime = startTime;
        this.endTime = null;
    }
}

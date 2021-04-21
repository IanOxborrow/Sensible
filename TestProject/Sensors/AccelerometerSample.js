/* eslint-disable prettier/prettier */
import SensorSample from './SensorSample';

export default class AccelerometerSample extends SensorSample
{
    constructor(x, y, z)
    {
        super();

        this.x = x;
        this.y = y;
        this.z = z;
    }

    /***
     * Returns the name of each component. This is mainly useful for the exporting stage where the
     * data is exported into a tabular form and headers are required
     *
     * @returns The name of each component in an array
     */
    getComponents()
    {
        return ['x', 'y', 'z'];
    }

    /***
     * Returns the stored data in the same order as the components
     *
     * @returns The stored data in an array
     */
    getData()
    {
        return [this.x, this.y, this.z];
    }
}

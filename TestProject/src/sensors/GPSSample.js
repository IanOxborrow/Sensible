/* eslint-disable prettier/prettier */
import SensorSample from './SensorSample';

export default class GPSSample extends SensorSample
{
    constructor(latitude, longitude, accuracy, altitude, heading, speed, timestamp)
    {
        super();

        this.latitude = latitude;
        this.longitude = longitude;
        this.accuracy = accuracy;
        this.altitude = altitude;
        this.heading = heading;
        this.speed = speed;
        this.timestamp = timestamp;
    }

    /***
     * Returns the name of each component. This is mainly useful for the exporting stage where the
     * data is exported into a tabular form and headers are required
     *
     * @returns The name of each component in an array
     */
    static getComponents()
    {
        return ['latitude', 'longitude', 'accuracy', 'altitude', 'heading', 'speed', 'timestamp'];
    }

    /***
     * Returns the stored data in the same order as the components
     *
     * @returns The stored data in an array
     */
    getData()
    {
        return [this.latitude, this.longitude, this.accuracy, this.altitude, this.heading, this.speed, this.timestamp];
    }
}

import Sensor from './Sensor';
import CameraBackSample  from './CameraBackSample';

export default class CameraBack extends Sensor 
{

    constructor (dataStore, sampleRate = null) 
    {
        super(dataStore)

    }

}
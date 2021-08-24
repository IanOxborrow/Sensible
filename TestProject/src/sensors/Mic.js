/* eslint-disable prettier/prettier */
import Sensor from './Sensor';
import MicStream from 'react-native-microphone-stream';
import { MicSample } from "../Sensors";

export default class Mic extends Sensor
{
    constructor(dataStore, sampleRate = null)
    {
        super(dataStore);

        // console.log(this.dataStore);

        function storeData(data) {
            // console.log("Just added a new sample");
            dataStore[dataStore.length - 1].addSamples(data, MicSample);
        }

        const micStream = MicStream.addListener((data) => {
            storeData(data);
        });

        MicStream.init({
            bufferSize: 4096,
            sampleRate: 44100,
            bitsPerChannel: 16,
            channelsPerFrame: 1,
        });

        this.enable(null);
    }

    enable(sampleRate)
    {
        if (!this.isEnabled)
        {
            this.isEnabled = true;
            MicStream.start();
        }
        else {throw new Error(this.constructor.name + '.enable: Sensor is already enabled!');}
    }

    disable()
    {
        if (this.isEnabled)
        {
            this.isEnabled = false;
            MicStream.pause();
        }
        else
        {
            throw new Error(this.constructor.name + '.disable: Sensor is already disabled!');
        }
    }

    updateSampleRate(sampleRate)
    {
        console.warn(this.constructor.name + '.updateSampleRate(sampleRate) has not been implemented');
    }
}

/* eslint-disable prettier/prettier */
import Sensor from './Sensor';
import MicStream from 'react-native-microphone-stream';

export default class Mic extends Sensor
{
    constructor(dataStore, sampleRate = 0)
    {
        super(dataStore);

        function storeData(data) {
            this.dataStore[this.dataStore.length - 1].addSamples(data);
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

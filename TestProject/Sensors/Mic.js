/* eslint-disable prettier/prettier */
import Sensor from './Sensor';
import MicStream from 'react-native-microphone-stream';

export default class Mic extends Sensor
{
    constructor(recording)
    {
        super(recording);
        const micStream = MicStream.addListener(data => {
            recording.graphableData = data;
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
        console.warn('Mic.enable(sampleRate) has not been implemented');
        // console.log('Enable!');
        // MicStream.start();
    }

    disable()
    {
        console.warn(this.constructor.name + '.disable() has not been implemented');
        // console.log('Disable!');
        // MicStream.stop();
    }

    updateSampleRate(sampleRate)
    {
        console.warn(this.constructor.name + '.updateSampleRate(sampleRate) has not been implemented');
    }
}

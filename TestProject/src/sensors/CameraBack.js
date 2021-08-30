import Sensor from './Sensor';
import CameraBackSample  from './CameraBackSample';

export default class CameraBack extends Sensor 
{

    constructor (dataStore, sampleRate = null) 
    {
        super(dataStore)

    }

    /*
    takeVideo = async () => {
        console.log("take video was called")
        const { isRecording } = this.state;
        if (this.camera && !isRecording) {
            console.log("about to start recording")
            try {
                const promise = this.camera.recordAsync(this.state.recordOptions);

                if (promise) {
                    this.setState({ isRecording: true });
                    const data = await promise;
                    console.warn('takeVideo', data);
                }
            } catch (e) {
                console.error(e);
            }
        }
    };

    stopVideo = async () => {
        await this.camera.stopRecording();
        this.setState({ isRecording: false });
    }; */

    record() {

    }

    stop() {

    }

}
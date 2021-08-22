// Credit to the react-native-microphone-stream package
package com.testproject;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import android.media.AudioRecord;
import android.media.MediaRecorder;
import android.media.AudioFormat;

import java.io.BufferedOutputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Arrays;

public class Microphone extends ReactContextBaseJavaModule {
    AudioRecord audioRecord;
    Runnable startRecording;
    Thread recording;
    int bufferSize;
    BufferedOutputStream bufferedOutputStream;
    boolean bSetupComplete = false;

    long start; // TODO: Remove this!

    /**
     * Perform any initial setup required. It is important to note that this
     * constructor will be called on app startup which means that any
     * variables which are initialised in this constructor will be initialised
     * from startup. As the microphone is not always going to be used, this
     * is an unnecessary use of resources.
     *
     * @param context The application context
     */
    Microphone(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "microphone";
    }

    /**
     * Initialise the microphone. This is performed outside the constructor
     * as the microphone isn't always used and means variables aren't initialised
     * unnecessarily.
     *
     * @param sampleRate The sample rate to use (in Hz)
     * @param bufferSize The total size (in bytes) of the buffer where audio
     *                   data is written to during the recording
     * @param filePath   The path of the file to save the data to
     */
    private void initialise(int sampleRate, int bufferSize, String filePath) {
        if (bSetupComplete) {
            throw new Error("[NATIVE_ANDROID] Microphone.initialise(): Attempted" +
                    " to initialise an already initialised microphone");
        }

        this.bufferSize = bufferSize;
        audioRecord = new AudioRecord(
                // TODO: Test out different audio sources
                MediaRecorder.AudioSource.VOICE_COMMUNICATION,
                sampleRate,
                // This channelConfig is guaranteed to work on all devices
                AudioFormat.CHANNEL_IN_MONO,
                // This audioFormat is guaranteed to work on all devices
                AudioFormat.ENCODING_PCM_16BIT,
                bufferSize
        );

        // Collect data from the microphone
        startRecording = () -> {
            System.out.println("Encoding started!");
            short[] buffer = new short[this.bufferSize];
            byte[] encoded = new byte[this.bufferSize];
            G711UCodec codec = new G711UCodec();

            while (!Thread.currentThread().isInterrupted())
            {
                audioRecord.read(buffer, 0, this.bufferSize);
                codec.encode(buffer, this.bufferSize, encoded, 0);
                try {
                    // TODO: Figure out a way to fix the storage space filling up
                    bufferedOutputStream.write(encoded);
                } catch (IOException e) {
                    System.out.println("Storage filled up in " + (System.currentTimeMillis() - start) + "ms");
                    throw new Error("[NATIVE_ANDROID] Microphone.initialise(): " + e);
                }
            }
            System.out.println("Encoding ended!");
        };

        bSetupComplete = true;
    }

    /**
     * Start collecting data from the microphone.
     *
     * @param sampleRate The sample rate to use (in Hz)
     * @param filePath   The path of the file to save the data to
     */
    @ReactMethod
    public void enable(int sampleRate, String filePath) {
        // Perform any initialisation necessary
        if (!bSetupComplete) {
            initialise(sampleRate, 8192, filePath);
        }

        start = System.currentTimeMillis();

        // Create a new file stream
        try {
            FileOutputStream fileOutputStream = new FileOutputStream(filePath);
            bufferedOutputStream = new BufferedOutputStream(fileOutputStream, 1 << 20);
        } catch (FileNotFoundException e) {
            throw new Error("[NATIVE_ANDROID] Microphone.enable(): " + e);
        }

        // Throw an error if a recording is already running
        if (recording != null && recording.isAlive()) {
            throw new Error("[NATIVE_ANDROID] Microphone.enable(): Attempted to" +
                    " enable an already enabled microphone. If this was the " +
                    "intended action, please disable the microphone then enable" +
                    " it again.");
        }

        // Create a new recording
        recording = new Thread(startRecording);
        recording.start();
    }

    @ReactMethod
    public void disable() {
        System.out.println("Stopping recording...");
        // Throw an error if a recording doesn't exist
        if (!recording.isAlive()) {
            throw new Error("[NATIVE_ANDROID] Microphone.disable(): Attempted to" +
                    " disable an uninitialised microphone.");
        }

        // Stop the recording
        recording.interrupt();
        try {
            bufferedOutputStream.close();
        } catch (IOException e) {
            throw new Error("[NATIVE_ANDROID] Microphone.disable(): " + e);
        }
        System.out.println("Recording stopped!");
    }
}

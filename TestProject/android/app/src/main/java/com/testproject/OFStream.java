package com.testproject;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

import java.util.Map;
import java.util.HashMap;

import android.util.Log;

import java.io.*;
import java.util.*;

public class OFStream extends ReactContextBaseJavaModule {
    List<BufferedOutputStream> outputStreams;

    OFStream(ReactApplicationContext context) {
        super(context);

        outputStreams = new ArrayList<>();
    }

    @Override
    public String getName() {
        return "ofstream";
    }

    /**
     * Creates a new file stream (a buffered file stream) which can later be used
     * to write to a file
     *
     * @param path    The path of the file to write to
     * @param append  Whether to append to the file or to over-write the content
     * @param promise Returns the index of the stream (required to write to the
     *                file) if successful, otherwise returns an error
     */
    @ReactMethod
    public void open(String path, boolean append, Promise promise) {
        int streamIndex = -1;

        try {
            // Create a new file stream
            FileOutputStream fileOutputStream = new FileOutputStream(path, append);
            BufferedOutputStream bufferedOutputStream = new BufferedOutputStream(fileOutputStream);
            // Index the file stream so that it can be used for output operations later
            streamIndex = outputStreams.size();
            outputStreams.add(bufferedOutputStream);
        } catch (IOException e) {
            e.printStackTrace();
            promise.reject(e);
        }

        System.out.println("Created a new output stream for " + path + " at index " + streamIndex);

        promise.resolve(streamIndex);
    }

    /**
     * Write content to an already initialised file stream
     *
     * @param streamIndex The index of the file stream to write to
     * @param text        The content to write to file
     */
    @ReactMethod
    public void write(int streamIndex, String text) {
        BufferedOutputStream outputStream = outputStreams.get(streamIndex);
        if (outputStream == null) {
            String error = "OFStream.write: Attempted to write to a stream that is already closed";
            Log.e("AndroidRuntime", error);
            throw new Error("[Android] " + error);
        }

        try {
            outputStreams.get(streamIndex).write(text.getBytes());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * @param path    The path of the file to write to
     * @param append  Whether to append to the file or to over-write the content
     * @param text    The content to write to file
     * @param promise Returns nothing on success, otherwise returns an error
     */
    @ReactMethod
    public void writeOnce(String path, boolean append, String text, Promise promise) {
        try (FileOutputStream fileOutputStream = new FileOutputStream(path, append)) {
            // Create a new file stream and write to it
            BufferedOutputStream bufferedOutputStream = new BufferedOutputStream(fileOutputStream);
            bufferedOutputStream.write(text.getBytes());
            bufferedOutputStream.close();
            promise.resolve(null);
        } catch (IOException e) {
            e.printStackTrace();
            promise.reject(e);
        }
    }

    /**
     * Close an already opened file stream
     *
     * @param streamIndex The index of the file stream to close
     * @param promise     Returns nothing on success, otherwise returns an error
     */
    @ReactMethod
    public void close(int streamIndex, Promise promise) {
        try {
            outputStreams.get(streamIndex).close();
            outputStreams.set(streamIndex, null);
            promise.resolve(null);
        } catch (IOException e) {
            e.printStackTrace();
            promise.reject(e);
        }
    }

    /**
     * Returns whether a file stream is currently opened or closed
     *
     * @param streamIndex The index of the file stream to check
     * @param promise     Returns whether the stream is opened or closed on success
     */
    @ReactMethod
    public void isOpen(int streamIndex, Promise promise) {
        promise.resolve(outputStreams.get(streamIndex) != null);
    }

    /**
     * Create a folder if it doesn't exist
     *
     * @param path    The path of the folder to create
     * @param promise Returns nothing on success, otherwise returns an error
     */
    @ReactMethod
    public void mkdir(String path, Promise promise) {
        File dir = new File(path);
        if (!dir.exists()) {
            if (dir.mkdirs()) {
                promise.resolve(null);
            }
            else {
                promise.reject(new Error("[Android] OFStream.mkDir: Could not create directory " + path));
            }
        }
    }
}

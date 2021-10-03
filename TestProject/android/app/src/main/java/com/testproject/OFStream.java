package com.testproject;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

import java.util.Map;
import java.util.HashMap;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;


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
     * Check if a file exists. An boolean value will be returned indicating if the file exsts
     *
     * @param path    The path of the file to read from
     * @param promise Returns the contents of the file on success, otherwise returns an error
     */
    @ReactMethod
    public void exists(String path, Promise promise) {
        File file = new File(path);
        promise.resolve(file.exists());
    }

    /**
     * Check if a file exists. An boolean value will be returned indicating if the file exsts
     *
     * @param path    The path of the file to read from
     * @param promise Returns the contents of the file on success, otherwise returns an error
     */
    @ReactMethod
    public void directoryExists(String path, Promise promise) {
        File file = new File(path);
        promise.resolve(file.isDirectory());
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
            Log.e("AndroidRuntime", e.toString());
            return;
        }

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
            String error = "OFStream.write: Attempted to write to a stream that is already closed. " + streamIndex;
            Log.e("AndroidRuntime", error);
            throw new Error("[Android] " + error);
        }

        try {
            outputStreams.get(streamIndex).write(text.getBytes());
        } catch (IOException e) {
            e.printStackTrace();
            Log.e("AndroidRuntime", e.toString());
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
            Log.e("AndroidRuntime", e.toString());
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
            Log.e("AndroidRuntime", e.toString());
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
        if (streamIndex < 0 || streamIndex > outputStreams.size()) {
            promise.resolve(false);
        }
        else {
            promise.resolve(outputStreams.get(streamIndex) != null);
        }
    }

    /**
     * Read the contents of a file. An empty string will be returned if the file does not exist
     *
     * @param path    The path of the file to read from
     * @param promise Returns the contents of the file on success, otherwise returns an error
     */
    @ReactMethod
    public void read(String path, Promise promise) {
        File file = new File(path);
        if (!file.exists()) {
            promise.resolve("");
            return;
        }

        StringBuilder content = new StringBuilder();
        try (FileInputStream fileInputStream = new FileInputStream(file)) {
            BufferedInputStream bufferedInputStream = new BufferedInputStream(fileInputStream);
            int c;
            while ((c = bufferedInputStream.read()) != -1) {
                content.append((char)c);
            }
            promise.resolve(content.toString());
        } catch (IOException e) {
            e.printStackTrace();
            promise.reject(e);
            Log.e("AndroidRuntime", e.toString());
        }
    }

    /**
     * @param path      The path of the file or folder to delete
     * @param recursive True if a folder and it's contents are to be deleted
     * @param promise   Returns nothing on success, otherwise returns an error
     */
    @ReactMethod
    public void delete(String path, boolean recursive, Promise promise) {
        File file = new File(path);
        // Do nothing if the file exists
        if (!file.exists()) {
            return;
        }
        // Ensure the recursive flag is present for folders
        else if (file.list() != null && !recursive) {
            String error = "[Android] OFStream.delete: Received a folder with no recursive flag. Path: " + path;
            promise.reject(new Error(error));
            Log.e("AndroidRuntime", error);
            return;
        }

        // Delete the file/folder
        boolean successful = true;
        Queue<File> delete = new LinkedList<>(Collections.singletonList(file));
        while (!delete.isEmpty())
        {
            File current = delete.poll();
            if (current == null) {
                String error = "[Android] OFStream.delete: Received a null file.";
                promise.reject(new Error(error));
                Log.e("AndroidRuntime", error);
                return;
            }
            // The recursive method has the potential to have duplicate items in the queue
            else if (!current.exists()) {
                continue;
            }

            // Delete empty folders and files
            if (current.list() == null || current.list().length == 0) {
                System.out.println("Deleted " + current.getAbsolutePath());
                successful = successful && current.delete();
            }
            // Add contents of folder then the folder to be deleted
            else {
                for (String subdirectory : current.list()) {
                    delete.add(new File(current.getAbsolutePath() + "/" + subdirectory));
                }
                delete.add(current);
            }
        }

        if (successful) {
            promise.resolve(null);
        }
        else {
            String error = "[Android] OFStream.delete: Could not delete " + path;
            promise.reject(new Error(error));
            Log.e("AndroidRuntime", error);
        }
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
                String error = "[Android] OFStream.mkDir: Could not create directory " + path;
                promise.reject(new Error(error));
                Log.e("AndroidRuntime", error);
            }
        }
    }

        /**
     * Create a folder if it doesn't exist
     *
     * @param origin    The file that is to be copied
     * @param destination The destination of the cloned file
     * @param promise Returns nothing on success, otherwise returns an error
     */
    @ReactMethod
    public void copyFile(String origin, String destination, Promise promise) {
        //Path originPath = Paths.getPath(origin);
        //Path destinationPath = Paths.getPath(destination);
        try {
            Files.copy(Paths.get(origin), Paths.get(destination));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

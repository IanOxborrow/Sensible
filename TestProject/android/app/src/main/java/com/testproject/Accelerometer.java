package com.testproject;

import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class Accelerometer extends ReactContextBaseJavaModule implements SensorEventListener {
    private final Sensor accelerometer;
    private final SensorManager sensorManager;
    private static Callback sampleRateCallback;
    private static SampleRateTracker sampleRateTracker;
    private static int maxSampleRate = -1;
    private boolean enabled = false;

    private static class SampleRateTracker {
        Timer sampleRateTimer;
        Timer sampleTimer;
        long sampleSum = 0;
        long sampleCount = 0;

        SampleRateTracker() {
            sampleRateTimer = new Timer(true);
            sampleTimer = new Timer(true);
        }

        /**
         * Add another sample to determine the average sample rate
         *
         * @param stopTimer True if no more samples will be collected, False otherwise
         */
        public void addSample(boolean stopTimer) {
            // Add how long it took to collect this sample
            sampleSum += sampleTimer.stop(Timer.Units.MICROSECONDS);
            sampleCount++;
            // Restart the timer if required
            if (!stopTimer) {
                sampleTimer.start();
            }
            else {
                sampleTimer = null;
            }
        }

        public void addSample() {
            addSample(false);
        }

        /**
         * Get the average sample rate using the collected samples
         *
         * @return Average sample rate
         */
        public long getAverageSampleRate() {
            addSample(true);

            long averageInterval = sampleSum/sampleCount;
            return (long) (1e6/averageInterval);

        }
    }

    Accelerometer(ReactApplicationContext context) {
        super(context);

        sensorManager = (SensorManager) context.getSystemService(Context.SENSOR_SERVICE);
        accelerometer = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
    }

    @Override
    public String getName() {
        return "accelerometer";
    }

    /**
     * Calculate the average maximum sample rate
     *
     * @param callback A callback with the average maximum sample rate
     */
    @ReactMethod
    public void calculateMaxSampleRate(Callback callback) {
        sampleRateCallback = callback;

        // Run a test to determine the maximum sample rate initially
        if (maxSampleRate < 0 && !enabled) {
            sensorManager.registerListener(this, accelerometer, 0);
            sampleRateTracker = new SampleRateTracker();
            enabled = true;
        }
        // Otherwise return the precalculated rate
        else if (maxSampleRate > 0) {
            sampleRateCallback.invoke(null, maxSampleRate);
        }
    }

    @Override
    public final void onSensorChanged(SensorEvent event) {
        // Calculate and return the maximum sample rate
        if (sampleRateTracker != null) {
            if (sampleRateTracker.sampleRateTimer.getDuration(Timer.Units.MINUTES) >= 3) {
                maxSampleRate = (int) sampleRateTracker.getAverageSampleRate();
                sampleRateTracker = null;
                sampleRateCallback.invoke(maxSampleRate);
            }
            else {
                sampleRateTracker.addSample();
            }
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {
    }
}

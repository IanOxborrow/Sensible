package com.testproject;

import android.util.Log;

public class Timer {
    private long start = -1;
    private long end = -1;
    private boolean running = false;

    enum Units {
        MINUTES,
        SECONDS,
        MILLISECONDS,
        MICROSECONDS,
        NANOSECONDS
    }

    Timer(boolean startTimer) {
        if (startTimer) {
            start();
        }
    }

    /**
     * Start the timer
     */
    public void start() {
        start = System.nanoTime();
        running = true;
    }

    /**
     * Stop the timer
     */
    public void stop() {
        end = System.nanoTime();
        running = false;
    }

    public long stop(Units units) {
        stop();
        return getDuration(units);
    }

    /**
     * Get how long the timer has been running for
     *
     * @return Timer duration (in microseconds)
     */
    public long getDuration(Units units) {
        if (start < 0) {
            String error = "Timer.getDuration: Attempted to get the duration of a timer which hasn't been started.";
            Log.e("AndroidRuntime", error);
            throw new Error("[Android] " + error);
        }

        if (running) {
            end = System.nanoTime();
        }

        switch (units)
        {
            case MINUTES:
                return ((end - start)/1000000000)/60;
            case SECONDS:
                return (end - start)/1000000000;
            case MILLISECONDS:
                return (end - start)/1000000;
            case MICROSECONDS:
                return (end - start)/1000;
            case NANOSECONDS:
                return end - start;
            default:
                throw new Error("[Android] Timer: Unknown unit type " + units);
        }
    }
}

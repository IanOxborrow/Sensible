/**
 * Created by Chathura Galappaththi
 *
 * Wait a given amount of milliseconds in the current thread. This function
 * MUST not be called from the main thread.
 *
 * @param milliseconds The number of milliseconds to wait
 */
export async function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

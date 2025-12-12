/**
 * Web Audio API configuration for metronome
 */

export const AUDIO_CONFIG = {
    frequencies: {
        /** High pitch for first beat (Hz) */
        firstBeat: 880,
        /** Low pitch for other beats (Hz) */
        otherBeats: 440
    },
    /** Click duration in seconds */
    clickDuration: 0.1
};

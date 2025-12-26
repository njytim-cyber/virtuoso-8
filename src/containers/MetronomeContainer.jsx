import { useEffect, useRef } from 'react';

/**
 * Looping Metronome Container - cycles continuously until stopped
 * Uses Web Audio API for precise timing (Chris Wilson's method)
 * 
 * @param {Object} props
 * @param {number} props.tempo - BPM
 * @param {string} props.timeSig - Time signature ('4/4', '6/8', '9/8')
 * @param {boolean} props.isPlaying - Play state
 * @param {Function} props.onComplete - Not used (loops forever)
 * @param {Function} props.onBeatChange - Callback with current beat number (1-4)
 */
export default function MetronomeContainer({ tempo, timeSig, isPlaying, onComplete, onBeatChange }) {
    const audioCtxRef = useRef(null);
    const nextNoteTimeRef = useRef(0.0);
    const timerIDRef = useRef(null);
    const beatRef = useRef(1);
    const notesInQueueRef = useRef([]); // { note: beat, time: time }

    // Scheduler configuration
    const lookahead = 25.0; // How frequently to call scheduling function (in milliseconds)
    const scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)

    useEffect(() => {
        // Initialize AudioContext once
        const initAudio = () => {
            if (!audioCtxRef.current) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                audioCtxRef.current = new AudioContext();
            }
            if (audioCtxRef.current.state === 'suspended') {
                audioCtxRef.current.resume();
            }
        };

        if (isPlaying) {
            initAudio();
            // Start playing
            beatRef.current = 1;
            // Reset nextNoteTime to current time
            nextNoteTimeRef.current = audioCtxRef.current.currentTime + 0.05;

            // console.log('[Metronome] Starting with precision scheduler');

            // Clean scheduler if exists
            if (timerIDRef.current) clearInterval(timerIDRef.current);

            // Start scheduler loop
            timerIDRef.current = setInterval(scheduler, lookahead);
        } else {
            // Stop playing
            if (timerIDRef.current) {
                clearInterval(timerIDRef.current);
                timerIDRef.current = null;
            }
        }

        return () => {
            if (timerIDRef.current) {
                clearInterval(timerIDRef.current);
            }
        };
    }, [isPlaying]);

    // Update tempo without restarting context, usually just updates the math in scheduler
    // implementation details: scheduler uses current 'tempo' prop

    const nextNote = () => {
        const secondsPerBeat = 60.0 / tempo;

        let beatsPerBar = 4;
        if (timeSig === '9/8') beatsPerBar = 3; // 9/8 is often counted as 3 dotted quarter beats, or 9 eighths. 
        // Assuming beatUnit input corresponds to tempo. 
        // If tempo is dotted-quarter, then beat is 1.
        // If tempo is quarter, check logic.
        // In this app, tempo for 9/8 is 50, which is likely dotted-quarter.
        else if (timeSig === '6/8') beatsPerBar = 2; // Usually 2 dotted-quarters

        // However, the app previously hardcoded 6 for 6/8 and 3 for 9/8?
        // Checking previous file:
        // if (timeSig === '9/8') beatsPerBar = 3;
        // else if (timeSig === '6/8') beatsPerBar = 6; (?? 6/8 is 2 beats usually, but maybe they want clicks on eighths?)

        // Replicating logic from previous version for consistency:
        if (timeSig === '9/8') beatsPerBar = 3; // 3 strong beats?
        else if (timeSig === '6/8') {
            // Previous code said: beatsPerBar = 6;
            // Let's stick to previous logic if valid, but 6/8 @ 120bpm as 6 clicks is VERY fast (120*6/2 = 360 clicks/min? No)
            beatsPerBar = 6;
        }

        nextNoteTimeRef.current += secondsPerBeat;

        beatRef.current++;
        if (beatRef.current > beatsPerBar) {
            beatRef.current = 1;
        }
    };

    const scheduleNote = (beatNumber, time) => {
        // Push the note to the queue to trace playback (for UI syncing, if we implemented a draw loop)
        notesInQueueRef.current.push({ note: beatNumber, time: time });

        // Create an oscillator
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();

        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination); // Using shared context

        if (beatNumber === 1) {
            osc.frequency.value = 800;
        } else {
            osc.frequency.value = 400;
        }

        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);

        osc.start(time);
        osc.stop(time + 0.1); // Short click

        // Schedule UI update
        // We can't schedule React state update with audio time, so we use setTimeout approx.
        // Difference between audioCtx.currentTime and Date.now() is an offset.
        // Easier: just setTimeout for (time - currentTime) * 1000
        const delay = Math.max(0, (time - audioCtxRef.current.currentTime) * 1000);

        setTimeout(() => {
            // Only update if still playing to avoid zombie state updates
            if (isPlaying && onBeatChange) {
                onBeatChange(beatNumber);
            }
        }, delay);
    };

    const scheduler = () => {
        // while there are notes that will play this time window
        while (nextNoteTimeRef.current < audioCtxRef.current.currentTime + scheduleAheadTime) {
            scheduleNote(beatRef.current, nextNoteTimeRef.current);
            nextNote();
        }
    };

    return null;
}

import { useEffect, useState } from 'react';

/**
 * Simple Metronome Container - cycles through beats 1-4
 * 
 * @param {Object} props
 * @param {number} props.tempo - BPM
 * @param {string} props.timeSig - Time signature ('4/4', '6/8', '9/8')
 * @param {boolean} props.isPlaying - Play state
 * @param {Function} props.onComplete - Callback when count-in completes
 * @param {Function} props.onBeatChange - Callback with current beat number (1-4)
 */
export default function MetronomeContainer({ tempo, timeSig, isPlaying, onComplete, onBeatChange }) {
    const [currentBeat, setCurrentBeat] = useState(1);

    useEffect(() => {
        if (!isPlaying) {
            setCurrentBeat(1);
            onBeatChange(1);
            return;
        }

        // Calculate number of beats
        let totalBeats = 4;
        if (timeSig === '9/8') totalBeats = 3;
        else if (timeSig === '6/8') totalBeats = 6;

        // Calculate interval in milliseconds
        const interval = (60000 / tempo); // ms per beat

        let beat = 1;
        let count = 0;

        // Initialize
        console.log('[Metronome] Starting at beat 1');
        onBeatChange(1);

        // Play click sound
        const playClick = (isFirstBeat) => {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.frequency.value = isFirstBeat ? 800 : 400;
            gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.1);

            osc.start(audioCtx.currentTime);
            osc.stop(audioCtx.currentTime + 0.1);
        };

        // Beat timer
        const timer = setInterval(() => {
            count++;

            if (count > totalBeats) {
                clearInterval(timer);
                onComplete();
                console.log('[Metronome] Complete!');
                return;
            }

            // Play sound
            playClick(beat === 1);

            // Update UI
            console.log('[Metronome] Beat:', beat);
            onBeatChange(beat);
            setCurrentBeat(beat);

            // Increment beat (cycle 1-4 or 1-6 or 1-3)
            beat++;
            if (beat > totalBeats) {
                beat = 1;
            }
        }, interval);

        return () => {
            clearInterval(timer);
            console.log('[Metronome] Cleaned up');
        };
    }, [isPlaying, tempo, timeSig, onComplete, onBeatChange]);

    return null; // Logic-only component
}

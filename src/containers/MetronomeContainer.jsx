import { useEffect, useRef } from 'react';

/**
 * Looping Metronome Container - cycles continuously until stopped
 * 
 * @param {Object} props
 * @param {number} props.tempo - BPM
 * @param {string} props.timeSig - Time signature ('4/4', '6/8', '9/8')
 * @param {boolean} props.isPlaying - Play state
 * @param {Function} props.onComplete - Not used (loops forever)
 * @param {Function} props.onBeatChange - Callback with current beat number (1-4)
 */
export default function MetronomeContainer({ tempo, timeSig, isPlaying, onComplete, onBeatChange }) {
    const timerRef = useRef(null);
    const beatRef = useRef(1);

    useEffect(() => {
        // Only run when isPlaying is true
        if (!isPlaying) {
            // Clean up timer when stopped
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            return;
        }

        // Calculate number of beats per bar
        let beatsPerBar = 4;
        if (timeSig === '9/8') beatsPerBar = 3;
        else if (timeSig === '6/8') beatsPerBar = 6;

        // Calculate interval in milliseconds
        const intervalMs = 60000 / tempo;

        // Reset beat counter
        beatRef.current = 1;

        console.log('[Metronome] Starting loop with', beatsPerBar, 'beats at', tempo, 'BPM');

        // Play click sound
        const playClick = (isFirstBeat) => {
            try {
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();

                osc.connect(gain);
                gain.connect(audioCtx.destination);

                osc.frequency.value = isFirstBeat ? 800 : 400;
                gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

                osc.start(audioCtx.currentTime);
                osc.stop(audioCtx.currentTime + 0.1);
            } catch (e) {
                console.warn('[Metronome] Audio error:', e);
            }
        };

        // Play first beat immediately
        playClick(true);
        onBeatChange(1);
        console.log('[Metronome] Beat: 1');

        // Set up interval for continuous looping
        timerRef.current = setInterval(() => {
            // Move to next beat
            beatRef.current++;

            // Wrap around to 1 after reaching max beats
            if (beatRef.current > beatsPerBar) {
                beatRef.current = 1;
            }

            // Play sound and update UI
            playClick(beatRef.current === 1);
            console.log('[Metronome] Beat:', beatRef.current);
            onBeatChange(beatRef.current);

        }, intervalMs);

        // Cleanup when stopped
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
                console.log('[Metronome] Stopped');
            }
        };
    }, [isPlaying, tempo, timeSig]);

    return null; // Logic-only component
}

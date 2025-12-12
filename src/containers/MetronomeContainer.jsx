import { useEffect, useRef } from 'react';
import { AUDIO_CONFIG } from '@config/audioConfig';

/**
 * Metronome Container - handles Web Audio API logic with precise timing
 * 
 * @param {Object} props
 * @param {number} props.tempo - BPM
 * @param {string} props.timeSig - Time signature
 * @param {boolean} props.isPlaying - Play state
 * @param {Function} props.onComplete - Callback when count-in completes
 * @param {Function} props.onBeatChange - Callback with current beat number
 */
export default function MetronomeContainer({ tempo, timeSig, isPlaying, onComplete, onBeatChange }) {
    const audioContext = useRef(null);
    const nextBeatTime = useRef(0);
    const currentBeat = useRef(0);
    const schedulerTimer = useRef(null);

    useEffect(() => {
        if (isPlaying) {
            if (!audioContext.current) {
                audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
            }

            let beats = 4;
            if (timeSig === '9/8') beats = 3;
            else if (timeSig === '6/8') beats = 6;
            else if (timeSig === '4/4') beats = 4;

            const secondsPerBeat = 60.0 / tempo;
            currentBeat.current = 0;
            nextBeatTime.current = audioContext.current.currentTime;

            const playClick = (time, beat) => {
                if (!audioContext.current) return;
                const osc = audioContext.current.createOscillator();
                const gain = audioContext.current.createGain();
                osc.connect(gain);
                gain.connect(audioContext.current.destination);

                // High pitch for first beat, low for others
                osc.frequency.value = beat === 1
                    ? AUDIO_CONFIG.frequencies.firstBeat
                    : AUDIO_CONFIG.frequencies.otherBeats;
                gain.gain.exponentialRampToValueAtTime(
                    0.00001,
                    time + AUDIO_CONFIG.clickDuration
                );

                osc.start(time);
                osc.stop(time + AUDIO_CONFIG.clickDuration);
            };

            const scheduler = () => {
                // Schedule beats slightly ahead of time for smooth playback
                const scheduleAheadTime = 0.1; // 100ms ahead

                while (nextBeatTime.current < audioContext.current.currentTime + scheduleAheadTime) {
                    currentBeat.current++;

                    if (currentBeat.current > beats) {
                        onComplete();
                        return;
                    }

                    playClick(nextBeatTime.current, currentBeat.current);

                    // Update UI on the main thread
                    setTimeout(() => {
                        onBeatChange(currentBeat.current);
                    }, (nextBeatTime.current - audioContext.current.currentTime) * 1000);

                    nextBeatTime.current += secondsPerBeat;
                }

                schedulerTimer.current = setTimeout(scheduler, 25); // Check every 25ms
            };

            scheduler();
        } else {
            onBeatChange(0);
        }

        return () => {
            if (schedulerTimer.current) {
                clearTimeout(schedulerTimer.current);
            }
        };
    }, [isPlaying, tempo, timeSig, onComplete, onBeatChange]);

    return null; // This is a logic-only component
}

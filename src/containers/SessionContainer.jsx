import { useState } from 'react';
import SessionView from '@views/SessionView';
import MetronomeContainer from './MetronomeContainer';

/**
 * Session Container - manages session state and metronome
 * 
 * @param {Object} props
 * @param {Array} props.queue - Session questions
 * @param {number} props.index - Current question index
 * @param {Function} props.onRate - Rating submission
 * @param {Object} props.userData - User data
 * @param {Array} props.history - Practice history
 * @param {Function} props.onBack - Navigate back callback
 */
export default function SessionContainer({ queue, index, onRate, userData, history, onBack }) {
    const [isPlayingMetronome, setIsPlayingMetronome] = useState(false);
    const [metronomeCount, setMetronomeCount] = useState(0);

    const currentQ = queue[index];

    const startCountIn = () => {
        setIsPlayingMetronome(true);
    };

    const handleCountInComplete = () => {
        setIsPlayingMetronome(false);
    };

    const handleBeatChange = (beat) => {
        setMetronomeCount(beat);
    };

    return (
        <>
            <MetronomeContainer
                tempo={currentQ.tempo}
                timeSig={currentQ.time}
                isPlaying={isPlayingMetronome}
                onComplete={handleCountInComplete}
                onBeatChange={handleBeatChange}
            />
            <SessionView
                queue={queue}
                index={index}
                onRate={onRate}
                userData={userData}
                history={history}
                metronomeCount={metronomeCount}
                isPlayingMetronome={isPlayingMetronome}
                onStartCountIn={startCountIn}
                onBack={onBack}
            />
        </>
    );
}

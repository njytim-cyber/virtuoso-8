import { useState, useEffect } from 'react';
import { Play, Info, Volume2, Music, Star, Clock, Activity, ArrowLeft } from 'lucide-react';
import StarRating from '@components/StarRating';
import MetronomeView from '@components/MetronomeView';
import { formatTitle, getNoteSymbol } from '@utils/formatters.jsx';

/**
 * Session practice view - displays question and metronome
 * 
 * @param {Object} props
 * @param {Array} props.queue - Array of 4 questions
 * @param {number} props.index - Current question index
 * @param {Function} props.onRate - Rating submission callback
 * @param {Object} props.userData - User profile data
 * @param {Array} props.history - Practice history
 * @param {number} props.metronomeCount - Current metronome beat
 * @param {boolean} props.isPlayingMetronome - Metronome playing state
 * @param {Function} props.onStartCountIn - Start metronome callback
 * @param {Function} props.onBack - Navigate back to dashboard callback
 */
export default function SessionView({
    queue,
    index,
    onRate,
    userData,
    history,
    metronomeCount,
    isPlayingMetronome,
    onStartCountIn,
    onBack
}) {
    const currentQ = queue[index];
    const [step, setStep] = useState('countin'); // countin, rating
    const [rating, setRating] = useState(0);
    const [showTutorial, setShowTutorial] = useState(false);
    const [showExitConfirm, setShowExitConfirm] = useState(false);

    // Stats Logic
    const qHistory = history.filter(h => h.questionId === currentQ.id);
    const attempts = qHistory.length;
    const average = attempts > 0
        ? (qHistory.reduce((acc, curr) => acc + curr.score, 0) / attempts).toFixed(1)
        : 0;

    useEffect(() => {
        setStep('countin');
        setRating(0);
        if (index === 0 && !userData?.tutorialSeen) {
            setShowTutorial(true);
        }
    }, [index, currentQ, userData]);

    // When metronome stops playing, show rating
    useEffect(() => {
        if (!isPlayingMetronome && metronomeCount > 0 && step === 'countin') {
            setStep('rating');
        }
    }, [isPlayingMetronome, metronomeCount, step]);

    if (!currentQ) return <div className="text-white text-center mt-10">Loading question...</div>;

    const handleRating = (score) => {
        onRate(score);
    };

    const handleBackClick = () => {
        setShowExitConfirm(true);
    };

    const handleConfirmExit = () => {
        if (onBack) {
            onBack();
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col relative overflow-hidden">
            {showTutorial && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setShowTutorial(false)}>
                    <div className="bg-white text-gray-900 p-6 rounded-2xl max-w-sm text-center">
                        <h3 className="text-xl font-bold mb-2">How to Practice</h3>
                        <ul className="text-left space-y-3 mb-6">
                            <li className="flex items-start"><Info className="mr-2 flex-shrink-0 text-indigo-600" /> Check the Scale Name and Bowing.</li>
                            <li className="flex items-start"><Volume2 className="mr-2 flex-shrink-0 text-indigo-600" /> Tap &quot;Count In&quot; to hear the tempo (1 bar).</li>
                            <li className="flex items-start"><Music className="mr-2 flex-shrink-0 text-indigo-600" /> Play the scale on your violin.</li>
                            <li className="flex items-start"><Star className="mr-2 flex-shrink-0 text-indigo-600" /> Be honest! Rate yourself to improve.</li>
                        </ul>
                        <button className="bg-indigo-600 text-white w-full py-2 rounded-lg">Got it!</button>
                    </div>
                </div>
            )}

            {/* Exit Confirmation Dialog */}
            {showExitConfirm && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
                    <div className="bg-white text-gray-900 p-6 rounded-2xl max-w-sm">
                        <h3 className="text-xl font-bold mb-3">Exit Session?</h3>
                        <p className="text-gray-600 mb-6">
                            You'll lose your progress for this session if you go back now.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowExitConfirm(false)}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg font-semibold transition-colors"
                            >
                                Stay
                            </button>
                            <button
                                onClick={handleConfirmExit}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
                            >
                                Leave
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
                {/* Back Button + Header Info */}
                <div className="w-full flex justify-between items-center text-gray-400 mb-8">
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={handleBackClick}
                            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                            title="Go back"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <span className="text-sm font-mono tracking-wider">QUESTION {index + 1} / 4</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${attempts === 0 ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 text-gray-400'}`}>
                            {attempts === 0 ? 'NEW' : `${attempts} tries • Avg ${average}`}
                        </span>
                        <span className="px-3 py-1 bg-gray-800 rounded-full text-xs font-bold">{currentQ.cat.toUpperCase()}</span>
                    </div>
                </div>

                {/* Main Card */}
                <div className="w-full text-center space-y-6">
                    <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                        {formatTitle(currentQ.title)}
                    </h2>

                    <div className="bg-indigo-900/30 border border-indigo-500/30 p-6 rounded-xl inline-block w-full max-w-lg mx-auto backdrop-blur-sm">
                        <p className="text-indigo-300 text-xs uppercase tracking-widest font-bold mb-2">Bowing Technique</p>
                        <p className="text-2xl font-semibold text-white">{currentQ.variant}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                        <div className="bg-gray-800/50 p-4 rounded-lg backdrop-blur-sm">
                            <p className="text-gray-400 text-xs uppercase mb-1">Time Sig</p>
                            <div className="flex items-center justify-center space-x-2">
                                <Clock size={16} className="text-gray-500" />
                                <p className="text-xl font-mono">{currentQ.time}</p>
                            </div>
                        </div>
                        <div className="bg-gray-800/50 p-4 rounded-lg backdrop-blur-sm">
                            <p className="text-gray-400 text-xs uppercase mb-1">Tempo</p>
                            <div className="flex items-center justify-center space-x-2">
                                <Activity size={16} className="text-gray-500" />
                                <p className="text-xl font-mono">{getNoteSymbol(currentQ.beatUnit)} = {currentQ.tempo}</p>
                            </div>
                        </div>
                    </div>

                    {/* Metronome Area */}
                    <div className="h-32 flex flex-col items-center justify-center">
                        {step === 'countin' && (
                            <>
                                {isPlayingMetronome ? (
                                    <div className="flex flex-col items-center space-y-4">
                                        <MetronomeView
                                            count={metronomeCount}
                                            timeSig={currentQ.time}
                                        />
                                        <button
                                            onClick={() => setStep('rating')}
                                            className="text-sm text-gray-400 hover:text-white transition-colors underline"
                                        >
                                            Done Playing!
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={onStartCountIn}
                                        className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-indigo-600/30"
                                    >
                                        <Play size={24} fill="currentColor" />
                                        <span>Start Count-In</span>
                                    </button>
                                )}
                            </>
                        )}

                        {/* Rating Area */}
                        {step === 'rating' && (
                            <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 w-full max-w-md">
                                <div className="bg-gray-800/80 backdrop-blur-md p-8 rounded-3xl border border-gray-700 shadow-2xl">
                                    <p className="text-gray-400 text-sm mb-4 uppercase tracking-widest">Performance Complete</p>
                                    <StarRating
                                        rating={rating}
                                        setRating={setRating}
                                    />
                                    {rating > 0 && (
                                        <button
                                            onClick={() => handleRating(rating)}
                                            className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold transition-all transform hover:translate-y-[-2px] shadow-lg shadow-green-500/30"
                                        >
                                            Next Question
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

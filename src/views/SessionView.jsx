import { useState, useEffect, useCallback } from 'react';
import { Play, Info, Volume2, Music, Star, Clock, Activity, ArrowLeft, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import StarRating from '@components/StarRating';
import MetronomeView from '@components/MetronomeView';
import { formatTitle, getNoteSymbol } from '@utils/formatters.jsx';

// ABRSM Scales and Arpeggios Marking Criteria
const SCALES_CRITERIA = {
    title: 'Scales & Arpeggios Criteria (out of 21)',
    grades: [
        { grade: 'Distinction', marks: '19-21', stars: 5, criteria: ['Highly accurate notes/pitch', 'Fluent and rhythmic', 'Musically shaped', 'Confident response'] },
        { grade: 'Merit', marks: '17-18', stars: 4, criteria: ['Largely accurate notes/pitch', 'Mostly regular flow', 'Mainly even tone', 'Secure response'] },
        { grade: 'Pass', marks: '14-16', stars: 3, criteria: ['Generally correct notes/pitch, despite errors', 'Continuity generally maintained', 'Generally reliable tone', 'Cautious response'] },
        { grade: 'Below Pass', marks: '11-13', stars: 2, criteria: ['Frequent errors in notes and/or pitch', 'Lacking continuity and/or some items incomplete', 'Unreliable tone', 'Uncertain response'] },
        { grade: 'Needs Work', marks: '7-10', stars: 1, criteria: ['Very approximate notes and/or pitch', 'Sporadic and/or frequently incomplete', 'Serious lack of tonal control', 'Very uncertain response'] },
    ]
};

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
    onStopMetronome,
    onBack
}) {
    const currentQ = queue[index];
    const [step, setStep] = useState('countin'); // countin, rating
    const [rating, setRating] = useState(0);
    const [showTutorial, setShowTutorial] = useState(false);
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const [hasStartedMetronome, setHasStartedMetronome] = useState(false);
    const [showCriteria, setShowCriteria] = useState(false); // Closed by default now

    // Wrap onStartCountIn to track that metronome was started
    const handleStartCountIn = () => {
        setHasStartedMetronome(true);
        onStartCountIn();
    };

    // TTS Effect
    const speakAnnouncement = useCallback(() => {
        if (!currentQ) return;
        window.speechSynthesis.cancel();
        // Use variant for bowing, or map 'both' to 'Separate Bows' if variant missing
        const bowing = currentQ.variant || (currentQ.bow === 'both' ? 'Separate Bows' : currentQ.bow);
        let text = `${currentQ.title}, ${bowing}`;

        // Normalize for TTS pronunciation
        text = text.replace(/#/g, " Sharp");
        // Robust flat detection: Matches A-G followed by 'b', if not followed by a lowercase letter (avoids 'Cab', 'Tab')
        text = text.replace(/([A-G])b(?![a-z])/g, "$1 Flat");
        text = text.replace(/3rds/g, " Thirds");
        text = text.replace(/6ths/g, " Sixths");
        text = text.replace(/7th/g, " Seventh");
        text = text.replace(/\+/g, " and ");

        // Remove parentheses around Octaves for cleaner speech
        text = text.replace(/\((\d) Octaves?\)/g, "$1 Octaves");
        text = text.replace(/\(1 Octave\)/g, "1 Octave");

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    }, [currentQ]);

    useEffect(() => {
        speakAnnouncement();
        return () => window.speechSynthesis.cancel();
    }, [currentQ]);

    // Stats Logic
    const qHistory = history.filter(h => h.questionId === currentQ.id);
    const attempts = qHistory.length;
    const average = attempts > 0
        ? (qHistory.reduce((acc, curr) => acc + curr.score, 0) / attempts).toFixed(1)
        : 0;

    useEffect(() => {
        setStep('countin');
        setRating(0);
        setHasStartedMetronome(false); // Reset when question changes
        if (index === 0 && !userData?.tutorialSeen) {
            setShowTutorial(true);
        }
    }, [index, currentQ, userData]);

    // When metronome stops playing AFTER being started, show rating
    useEffect(() => {
        if (hasStartedMetronome && !isPlayingMetronome && step === 'countin') {
            setStep('rating');
        }
    }, [isPlayingMetronome, hasStartedMetronome, step]);

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
        <>
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

                {/* Exit Confirmation Dialog - Playful Edition */}
                {showExitConfirm && (
                    <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
                        <div className="bg-white text-gray-900 p-8 rounded-3xl max-w-sm text-center transform transition-all scale-100 shadow-2xl">
                            <div className="mb-4 text-4xl">🎭</div>
                            <h3 className="text-2xl font-black mb-3 text-indigo-900">Pause the Performance?</h3>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                You&apos;re in the flow! Leaving now means this session&apos;s progress won&apos;t be saved in your history.
                            </p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => setShowExitConfirm(false)}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-xl font-bold transition-all transform hover:scale-[1.02] shadow-lg shadow-indigo-200"
                                >
                                    The Show Must Go On! 🎻
                                </button>
                                <button
                                    onClick={handleConfirmExit}
                                    className="w-full bg-white hover:bg-gray-50 text-gray-400 hover:text-red-500 py-3 px-6 rounded-xl font-bold transition-colors text-sm"
                                >
                                    Exit Stage Left
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
                        <div className="relative">
                            <h2 className="text-3xl md:text-5xl font-bold leading-tight px-8">
                                {formatTitle(currentQ.title)}
                            </h2>
                            <button
                                onClick={speakAnnouncement}
                                className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-white transition-colors"
                                title="Replay Audio"
                            >
                                <Volume2 size={24} />
                            </button>
                        </div>

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
                                                onClick={() => {
                                                    onStopMetronome();
                                                    setStep('rating');
                                                }}
                                                className="text-sm text-gray-400 hover:text-white transition-colors underline"
                                            >
                                                Done Playing!
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handleStartCountIn}
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
                                <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 w-full max-w-md space-y-4">
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

                                    {/* Help Button */}
                                    <button
                                        onClick={() => setShowCriteria(true)}
                                        className="w-full py-3 flex items-center justify-center space-x-2 text-gray-400 hover:text-white transition-colors border border-gray-700 rounded-xl hover:bg-gray-800"
                                    >
                                        <HelpCircle size={18} />
                                        <span>How should I rate myself?</span>
                                    </button>

                                    {/* Marking Criteria Modal */}
                                    {showCriteria && (
                                        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowCriteria(false)}>
                                            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                                                <div className="flex justify-between items-center mb-4">
                                                    <h3 className="text-lg font-bold text-white">Rating Criteria</h3>
                                                    <button onClick={() => setShowCriteria(false)} className="text-gray-400 hover:text-white">
                                                        <span className="text-2xl">&times;</span>
                                                    </button>
                                                </div>

                                                <div className="overflow-y-auto pr-2 space-y-3">
                                                    <p className="text-sm text-gray-400 font-medium">{SCALES_CRITERIA.title}</p>
                                                    {SCALES_CRITERIA.grades.map((grade, idx) => (
                                                        <div key={idx} className={`p-3 rounded-lg ${grade.stars >= 4 ? 'bg-green-900/30 border border-green-700/50' : grade.stars === 3 ? 'bg-yellow-900/30 border border-yellow-700/50' : 'bg-red-900/30 border border-red-700/50'}`}>
                                                            <div className="flex items-center justify-between mb-1">
                                                                <span className="font-semibold text-white text-sm">{grade.grade}</span>
                                                                <div className="flex items-center space-x-2">
                                                                    <span className="text-xs text-gray-400">{grade.marks} marks</span>
                                                                    <span className="text-yellow-400 flex">{'★'.repeat(grade.stars)}</span>
                                                                </div>
                                                            </div>
                                                            <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
                                                                {grade.criteria.map((c, i) => (
                                                                    <li key={i}>{c}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ))}
                                                </div>

                                                <button
                                                    onClick={() => setShowCriteria(false)}
                                                    className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold transition-colors"
                                                >
                                                    Got it
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>


        </>
    );
}

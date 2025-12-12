import { RotateCcw, Star } from 'lucide-react';
import { QUESTIONS } from '@data/questions';

/**
 * Review view - displays all questions with attempt history
 * 
 * @param {Object} props
 * @param {Array} props.history - Practice history entries
 * @param {Function} props.onBack - Return to dashboard callback
 */
export default function ReviewView({ history, onBack }) {
    const categories = ['Scales', 'Arpeggios', 'Misc', 'DoubleStops'];

    const getStats = (qId) => {
        const attempts = history.filter(h => h.questionId === qId);
        if (attempts.length === 0) return { count: 0, avg: 0, last: 0 };
        const sum = attempts.reduce((acc, curr) => acc + curr.score, 0);
        return {
            count: attempts.length,
            avg: (sum / attempts.length).toFixed(1),
            last: attempts[attempts.length - 1].score
        };
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm p-4 sticky top-0 z-10 flex items-center">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full mr-2">
                    <RotateCcw size={20} className="text-gray-600" />
                </button>
                <h2 className="font-bold text-lg text-gray-800">Progress Review</h2>
            </div>

            <div className="max-w-2xl mx-auto p-4 space-y-8">
                {categories.map(cat => (
                    <div key={cat} className="space-y-3">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider pl-2">{cat}</h3>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            {QUESTIONS.filter(q => q.cat === cat).map((q) => {
                                const stats = getStats(q.id);
                                const isAttempted = stats.count > 0;
                                return (
                                    <div key={q.id} className={`p-4 border-b border-gray-100 last:border-0 flex justify-between items-center ${!isAttempted ? 'opacity-60 bg-gray-50' : ''}`}>
                                        <div className="flex-1">
                                            <p className={`font-medium ${isAttempted ? 'text-gray-900' : 'text-gray-500'}`}>{q.title}</p>
                                            <p className="text-xs text-gray-400">{q.time} • {q.tempo} BPM</p>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            {isAttempted ? (
                                                <div className="text-right">
                                                    <div className="flex items-center text-yellow-500">
                                                        <span className="font-bold mr-1">{stats.last}</span> <Star size={12} fill="currentColor" />
                                                    </div>
                                                    <div className="text-xs text-gray-400">{stats.count} tries</div>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400 px-2 py-1 bg-gray-200 rounded">Untouched</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

import { Star, Trophy, Target, TrendingUp, CheckCircle2, Music, Eye, Headphones, ArrowLeft, Share } from 'lucide-react';
import { QUESTIONS } from '@data/questions';

// Progress log categories (same as ProgressLogView)
const PROGRESS_CATEGORIES = [
    {
        id: 'pieces',

        title: 'Pieces',
        marks: 90,
        icon: Music,
        color: 'indigo',
        items: [
            { id: 'piece_baroque', label: 'List A (Baroque/Classical)' },
            { id: 'piece_romantic', label: 'List B (Romantic)' },
            { id: 'piece_modern', label: 'List C (Modern)' },
        ]
    },
    {
        id: 'sight_reading',

        title: 'Sight-Reading',
        marks: 21,
        icon: Eye,
        color: 'emerald',
        items: [
            { id: 'sr_grade6', label: 'Grade 6' },
            { id: 'sr_grade7', label: 'Grade 7' },
            { id: 'sr_grade8', label: 'Grade 8' },
        ]
    },
    {
        id: 'aural',

        title: 'Aural Tests',
        marks: 18,
        icon: Headphones,
        color: 'purple',
        items: [
            { id: 'aural_8a', label: '8A: Cadences & Chords' },
            { id: 'aural_8b', label: '8B: Sight-Singing' },
            { id: 'aural_8c', label: '8C: Modulation' },
            { id: 'aural_8d', label: '8D: Musical Features' },
        ]
    }
];

/**
 * Calculate estimated exam mark based on practice data
 */
function calculateEstimatedMark(history, progressLog) {
    // Technical Work: 21 marks
    const technicalRatings = history.map(h => h.score).filter(s => s > 0);
    const avgTechnical = technicalRatings.length > 0
        ? technicalRatings.reduce((a, b) => a + b, 0) / technicalRatings.length
        : 0;
    const technicalMark = Math.round((avgTechnical / 5) * 21);

    // Pieces: 90 marks
    const pieceIds = ['piece_baroque', 'piece_romantic', 'piece_modern'];
    const pieceRatings = pieceIds.map(id => progressLog[id] || 0);
    const avgPieces = pieceRatings.filter(r => r > 0).length > 0
        ? pieceRatings.reduce((a, b) => a + b, 0) / pieceRatings.filter(r => r > 0).length
        : 0;
    const piecesMark = Math.round((avgPieces / 5) * 90);

    // Sight-Reading: 21 marks
    const srIds = ['sr_grade6', 'sr_grade7', 'sr_grade8'];
    const srRatings = srIds.map(id => progressLog[id] || 0);
    const avgSR = srRatings.filter(r => r > 0).length > 0
        ? srRatings.reduce((a, b) => a + b, 0) / srRatings.filter(r => r > 0).length
        : 0;
    const sightReadingMark = Math.round((avgSR / 5) * 21);

    // Aural: 18 marks
    const auralIds = ['aural_8a', 'aural_8b', 'aural_8c', 'aural_8d'];
    const auralRatings = auralIds.map(id => progressLog[id] || 0);
    const avgAural = auralRatings.filter(r => r > 0).length > 0
        ? auralRatings.reduce((a, b) => a + b, 0) / auralRatings.filter(r => r > 0).length
        : 0;
    const auralMark = Math.round((avgAural / 5) * 18);

    return piecesMark + technicalMark + sightReadingMark + auralMark;
}

/** 
 * @param {Object} props
 * @param {Array} props.history - Practice history entries
 * @param {Object} props.progressLog - Progress log ratings
 * @param {Function} props.onBack - Return to dashboard callback
 */
export default function ReviewView({ history, progressLog = {}, userData, onBack }) {
    const categories = ['Scales', 'Arpeggios', 'Dominants, Diminished and Chromatics', 'Double Stops'];
    const estimatedMark = calculateEstimatedMark(history, progressLog);

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

    // Calculate overall stats
    const totalQuestions = QUESTIONS.length;
    const attemptedQuestions = new Set(history.map(h => h.questionId)).size;
    const masteredQuestions = [...new Set(history.map(h => h.questionId))].filter(qId => {
        const stats = getStats(qId);
        return stats.last >= 4; // 4 or 5 stars = mastered
    }).length;
    const totalAttempts = history.length;
    const avgScore = totalAttempts > 0
        ? (history.reduce((acc, h) => acc + h.score, 0) / totalAttempts).toFixed(1)
        : 0;

    // Category stats for scales/arpeggios
    const getCategoryStats = (cat) => {
        const catQuestions = QUESTIONS.filter(q => q.cat === cat);
        const attempted = catQuestions.filter(q => getStats(q.id).count > 0).length;
        const mastered = catQuestions.filter(q => getStats(q.id).last >= 4).length;
        return { total: catQuestions.length, attempted, mastered };
    };

    // Progress log stats
    const getProgressStats = (category) => {
        const ratedItems = category.items.filter(item => progressLog[item.id] > 0);
        const masteredItems = category.items.filter(item => progressLog[item.id] >= 4);
        return {
            rated: ratedItems.length,
            total: category.items.length,
            mastered: masteredItems.length
        };
    };

    const colorClasses = {
        indigo: { bg: 'bg-indigo-600', border: 'border-indigo-500', text: 'text-indigo-400' },
        emerald: { bg: 'bg-emerald-600', border: 'border-emerald-500', text: 'text-emerald-400' },
        purple: { bg: 'bg-purple-600', border: 'border-purple-500', text: 'text-purple-400' },
    };

    const handleShare = async () => {
        const text = `🎻 Virtuoso 8 Progress for ${userData?.name || 'Student'}

Estimated Mark: ${estimatedMark}/150
Mastered: ${masteredQuestions} / ${totalQuestions} Questions

Log My Progress:
Pieces: ${getProgressStats(PROGRESS_CATEGORIES[0]).rated}/3
Sight-Reading: ${getProgressStats(PROGRESS_CATEGORIES[1]).rated}/3
Aural: ${getProgressStats(PROGRESS_CATEGORIES[2]).rated}/4

Practice makes progress!`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Virtuoso 8 Progress',
                    text: text,
                });
            } catch (err) {
                // Ignore cancel
            }
        } else {
            await navigator.clipboard.writeText(text);
            alert('Progress summary copied to clipboard!');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            {/* Header */}
            <div className="bg-slate-800 border-b border-slate-700 p-4 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center">
                        <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-full mr-3 transition-colors">
                            <ArrowLeft size={20} className="text-slate-400" />
                        </button>
                        <h1 className="text-2xl font-bold">Progress Review</h1>
                    </div>
                    <button
                        onClick={handleShare}
                        className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-semibold transition-colors shadow-lg shadow-indigo-500/20"
                    >
                        <Share size={18} />
                        <span>Share</span>
                    </button>
                </div>
            </div>

            {/* Summary Stats Bar - Simplified */}
            <div className="bg-slate-800 border-b border-slate-700 px-4 py-3">
                <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-6 text-sm">
                    <div className="flex items-center space-x-2">
                        <TrendingUp size={16} className="text-indigo-400" />
                        <span className="text-indigo-400 font-bold">{estimatedMark}/150</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Target size={16} className="text-slate-400" />
                        <span className="text-slate-300">{attemptedQuestions}/{totalQuestions} Scales</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <CheckCircle2 size={16} className="text-green-400" />
                        <span className="text-green-400">{masteredQuestions} Mastered</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Trophy size={16} className="text-yellow-400" />
                        <span className="text-yellow-400">{avgScore} Avg</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-4 space-y-6">
                {/* Progress Log Sections */}
                <div>
                    <h3 className="text-lg font-semibold text-slate-300 mb-3">Exam Components</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        {PROGRESS_CATEGORIES.map(category => {
                            const Icon = category.icon;
                            const stats = getProgressStats(category);
                            const colors = colorClasses[category.color];

                            return (
                                <div key={category.id} className={`bg-slate-800 rounded-xl overflow-hidden border ${colors.border}`}>
                                    <div className={`${colors.bg} px-4 py-3 flex items-center justify-between select-none`}>
                                        <div className="flex items-center space-x-2">
                                            <Icon size={18} className="text-white" />
                                            <h4 className="font-bold text-white">{category.title} <span className="text-white/60 text-sm font-normal ml-1">({category.marks} marks)</span></h4>
                                        </div>
                                        <span className="text-white/80 text-sm">
                                            {stats.rated}/{stats.total} rated
                                        </span>
                                    </div>
                                    <div className="space-y-1 py-2">
                                        {category.items.map(item => {
                                            const rating = progressLog[item.id] || 0;
                                            const isMastered = rating >= 4;

                                            return (
                                                <div
                                                    key={item.id}
                                                    className={`px-4 py-2.5 flex justify-between items-center ${isMastered ? 'bg-green-500/5' : rating === 0 ? 'opacity-50' : ''}`}
                                                >
                                                    <span className={`text-sm font-medium ${isMastered ? 'text-green-400' : rating > 0 ? 'text-white' : 'text-slate-500'}`}>
                                                        {item.label}
                                                    </span>
                                                    {rating > 0 ? (
                                                        <div className="flex items-center">
                                                            {[1, 2, 3, 4, 5].map(s => (
                                                                <Star
                                                                    key={s}
                                                                    size={10}
                                                                    className={s <= rating ? 'text-yellow-400' : 'text-slate-600'}
                                                                    fill={s <= rating ? 'currentColor' : 'none'}
                                                                />
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-slate-600">—</span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Technical Work (Scales & Arpeggios) */}
                <div>
                    <h3 className="text-lg font-semibold text-slate-300 mb-3">Technical Work (21 marks)</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        {categories.map(cat => {
                            const catStats = getCategoryStats(cat);
                            const catQuestions = QUESTIONS.filter(q => q.cat === cat);

                            return (
                                <div key={cat} className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
                                    {/* Category Header */}
                                    <div className="bg-slate-700/50 px-4 py-3 flex items-center justify-between select-none">
                                        <h3 className="font-bold text-lg">{cat}</h3>
                                        <div className="flex items-center space-x-3 text-sm">
                                            <span className="text-slate-400">
                                                {catStats.attempted}/{catStats.total}
                                            </span>
                                            <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full text-xs">
                                                {catStats.mastered} mastered
                                            </span>
                                        </div>
                                    </div>

                                    {/* Questions List - Compact */}
                                    <div className="divide-y divide-slate-700/50 max-h-[300px] overflow-y-auto">
                                        {catQuestions.map((q) => {
                                            const stats = getStats(q.id);
                                            const isAttempted = stats.count > 0;
                                            const isMastered = stats.last >= 4;

                                            return (
                                                <div
                                                    key={q.id}
                                                    className={`px-4 py-2.5 flex justify-between items-center ${isMastered ? 'bg-green-500/5' :
                                                        !isAttempted ? 'opacity-50' : ''
                                                        }`}
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`font-medium text-sm truncate ${isMastered ? 'text-green-400' :
                                                            isAttempted ? 'text-white' : 'text-slate-500'
                                                            }`}>
                                                            {q.title}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center space-x-2 ml-3">
                                                        {isAttempted ? (
                                                            <>
                                                                <div className="flex items-center">
                                                                    {[1, 2, 3, 4, 5].map(s => (
                                                                        <Star
                                                                            key={s}
                                                                            size={10}
                                                                            className={s <= stats.last ? 'text-yellow-400' : 'text-slate-600'}
                                                                            fill={s <= stats.last ? 'currentColor' : 'none'}
                                                                        />
                                                                    ))}
                                                                </div>
                                                                <span className="text-xs text-slate-500 w-8 text-right">
                                                                    ×{stats.count}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="text-xs text-slate-600">—</span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

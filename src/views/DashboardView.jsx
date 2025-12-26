import { useState, useMemo } from 'react';
import { Play, TrendingUp, Trophy, ClipboardList, Calendar, Share, Moon, Sun, Mic, ArrowRight, Music, Eye, Headphones, Activity } from 'lucide-react';
import { QUESTIONS } from '@data/questions';

// Calculate days until exam (April 1st, 2026)
const EXAM_DATE = new Date('2026-04-01T00:00:00');
function getDaysUntilExam() {
    const now = new Date();
    const diff = EXAM_DATE - now;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

/**
 * Calculate estimated exam mark based on practice data
 * Exam breakdown: Pieces (90), Technical (21), Sight-Reading (21), Aural (18) = 150 total
 */
function calculateStats(history, progressLog) {
    // Technical Work: 21 marks
    const technicalRatings = history.map(h => h.score).filter(s => s > 0);
    const avgTechnical = technicalRatings.length > 0
        ? technicalRatings.reduce((a, b) => a + b, 0) / technicalRatings.length
        : 0;
    const technicalMark = Math.round((avgTechnical / 5) * 21);

    // Pieces: 90 marks
    const pieceIds = ['piece_baroque', 'piece_romantic', 'piece_modern'];
    const pieceRatings = pieceIds.map(id => progressLog[id] || 0);
    const pieceMark = pieceRatings.reduce((sum, rating) => sum + Math.round((rating / 5) * 30), 0);

    // Sight-Reading: 21 marks
    const srIds = ['sr_grade6', 'sr_grade7', 'sr_grade8'];
    const srRatings = srIds.map(id => progressLog[id] || 0).filter(r => r > 0);
    const avgSR = srRatings.length > 0 ? srRatings.reduce((a, b) => a + b, 0) / srRatings.length : 0;
    const sightReadingMark = Math.round((avgSR / 5) * 21);

    // Aural: 18 marks
    const auralIds = ['aural_8a', 'aural_8b', 'aural_8c', 'aural_8d'];
    const auralRatings = auralIds.map(id => progressLog[id] || 0).filter(r => r > 0);
    const avgAural = auralRatings.length > 0 ? auralRatings.reduce((a, b) => a + b, 0) / auralRatings.length : 0;
    const auralMark = Math.round((avgAural / 5) * 18);

    return {
        total: technicalMark + pieceMark + sightReadingMark + auralMark,
        breakdown: {
            pieces: { score: pieceMark, max: 90, label: 'Pieces', icon: Music, color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
            technical: { score: technicalMark, max: 21, label: 'Technical', icon: Activity, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
            sightReading: { score: sightReadingMark, max: 21, label: 'Sight-Reading', icon: Eye, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
            aural: { score: auralMark, max: 18, label: 'Aural Tests', icon: Headphones, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' }
        }
    };
}

/**
 * Dashboard view - main navigation and progress display
 * 
 * @param {Object} props
 * @param {Object} props.userData - User profile data
 * @param {Array} props.history - Practice history entries
 * @param {Object} props.progressLog - Progress log ratings
 * @param {Function} props.onStart - Start session callback
 * @param {Function} props.onReview - Open review callback
 * @param {Function} props.onLogProgress - Open progress log callback
 * @param {Function} props.onUpdateName - Update user name callback
 */
export default function DashboardView({ userData, history, progressLog = {}, onStart, onReview, onLogProgress, onUpdateName, darkMode, toggleDarkMode }) {
    const [isEditingName, setIsEditingName] = useState(false);
    const [editedName, setEditedName] = useState('');

    // Calculate estimated mark
    const { total: estimatedMark, breakdown } = useMemo(() =>
        calculateStats(history, progressLog),
        [history, progressLog]
    );

    // Next Suggested Action
    const nextAction = useMemo(() => {
        // Find items with low scores or never attempted
        const candidates = QUESTIONS.filter(q => {
            const hist = history.filter(h => h.questionId === q.id);
            if (hist.length === 0) return true;
            const lastScore = hist[hist.length - 1].score;
            return lastScore < 4;
        });

        const q = candidates.length > 0
            ? candidates[Math.floor(Math.random() * candidates.length)]
            : QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];

        return q;
    }, [history]);

    const streaks = typeof userData.streaks === 'number' ? userData.streaks : 0;
    const name = userData.name || 'Student';

    const handleNameClick = () => {
        setEditedName(name);
        setIsEditingName(true);
    };

    const handleNameSave = () => {
        if (editedName.trim() && onUpdateName) {
            onUpdateName(editedName.trim());
        }
        setIsEditingName(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleNameSave();
        } else if (e.key === 'Escape') {
            setIsEditingName(false);
        }
    };

    // Determine grade based on mark
    const getGrade = (mark) => {
        if (mark >= 130) return { grade: 'Distinction', color: 'text-yellow-300' };
        if (mark >= 120) return { grade: 'Merit', color: 'text-indigo-200' };
        if (mark >= 100) return { grade: 'Pass', color: 'text-green-200' };
        return { grade: 'Keep Practising', color: 'text-indigo-100' };
    };

    const { grade, color } = getGrade(estimatedMark);

    const handleShare = async () => {
        const text = `🎻 Virtuoso 8 Progress for ${name}

Estimated Mark: ${estimatedMark}/150 (${grade})

Breakdown:
Pieces: ${breakdown.pieces.score}/90
Technical: ${breakdown.technical.score}/21
Sight-Reading: ${breakdown.sightReading.score}/21
Aural: ${breakdown.aural.score}/18

Practice makes progress!`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Virtuoso 8 Progress',
                    text: text,
                });
            } catch (err) {
                // Ignore
            }
        } else {
            await navigator.clipboard.writeText(text);
            alert('Progress summary copied to clipboard!');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors pb-20">
            {/* Status Bar */}
            <div className="bg-indigo-900 text-white px-6 py-3 shadow-md">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                            <Calendar size={18} className="text-indigo-300" />
                            <span className="font-semibold text-sm">Exam in {getDaysUntilExam()} Days</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Trophy size={18} className="text-orange-400" />
                            <span className="font-semibold text-sm">{streaks} Day Streak</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleShare}
                            className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                            title="Share Progress"
                        >
                            <Share size={18} />
                        </button>
                        <button
                            onClick={toggleDarkMode}
                            className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                            title={darkMode ? "Light Mode" : "Dark Mode"}
                        >
                            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Header / Hero */}
            <header className="bg-white dark:bg-slate-800 shadow-sm pt-6 pb-8 px-6 mb-6 transition-colors border-b border-gray-100 dark:border-slate-700">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md">
                                <img src="/avatar.png" alt="User" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                {isEditingName ? (
                                    <input
                                        type="text"
                                        value={editedName}
                                        onChange={(e) => setEditedName(e.target.value)}
                                        onBlur={handleNameSave}
                                        onKeyDown={handleKeyPress}
                                        autoFocus
                                        className="text-3xl font-bold text-gray-900 dark:text-white border-b-2 border-indigo-500 outline-none bg-transparent px-1"
                                    />
                                ) : (
                                    <h1
                                        className="text-3xl font-bold text-gray-900 dark:text-white cursor-pointer hover:text-indigo-600 transition-colors"
                                        onClick={handleNameClick}
                                    >
                                        Hi, {name}
                                    </h1>
                                )}
                                <p className="text-gray-500 dark:text-gray-400">Ready to master Grade 8?</p>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400 leading-none">
                                {estimatedMark}<span className="text-lg text-gray-400 font-medium">/150</span>
                            </div>
                            <div className={`font-semibold ${color}`}>{grade}</div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.values(breakdown).map((stat) => (
                            <div key={stat.label} className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4 flex flex-col justify-between">
                                <div className="flex justify-between items-start mb-2">
                                    <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                                        <stat.icon size={20} />
                                    </div>
                                    <span className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 tracking-wider">
                                        / {stat.max}
                                    </span>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-800 dark:text-white">{stat.score}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 space-y-8">

                {/* Next Action Card */}
                <section>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">Suggested Practice</h2>
                    <button
                        onClick={onStart}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 md:p-8 text-white shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all group text-left relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Play size={120} />
                        </div>
                        <div className="relative z-10">
                            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md rounded-full px-3 py-1 text-xs font-bold mb-4 border border-white/20">
                                <Play size={12} fill="currentColor" />
                                <span>NEXT UP</span>
                            </div>
                            <h3 className="text-2xl md:text-4xl font-bold mb-2 leading-tight max-w-2xl">
                                {nextAction.title}
                            </h3>
                            <div className="text-indigo-100 font-medium">{nextAction.cat} • {nextAction.time}</div>

                            <div className="mt-6 flex items-center font-bold text-sm bg-white text-indigo-600 px-6 py-3 rounded-full inline-block group-hover:bg-indigo-50 transition-colors">
                                Start Practice <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </button>
                </section>

                {/* Secondary Actions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Scales (Browse) */}
                    <button
                        onClick={onStart}
                        className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 hover:border-indigo-500 hover:shadow-md transition-all group text-left flex flex-col h-full"
                    >
                        <div className="mb-4 bg-indigo-50 dark:bg-indigo-900/20 w-12 h-12 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                            <Play fill="currentColor" size={24} />
                        </div>
                        <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-1">Browse Scales</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">42 Exercises</p>
                    </button>

                    {/* Log Progress */}
                    <button
                        onClick={onLogProgress}
                        className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 hover:border-purple-500 hover:shadow-md transition-all group text-left flex flex-col h-full"
                    >
                        <div className="mb-4 bg-purple-50 dark:bg-purple-900/20 w-12 h-12 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                            <ClipboardList size={24} />
                        </div>
                        <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-1">Log Progress</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Pieces, Aural, Sight-Reading</p>
                    </button>

                    {/* Quick Record */}
                    <button
                        onClick={() => alert("Recording started! (Mock)")}
                        className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 hover:border-red-500 hover:shadow-md transition-all group text-left flex flex-col h-full"
                    >
                        <div className="mb-4 bg-red-50 dark:bg-red-900/20 w-12 h-12 rounded-xl flex items-center justify-center text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
                            <Mic size={24} />
                        </div>
                        <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-1">Quick Record</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Capture a run-through</p>
                    </button>

                </div>
            </div>
        </div>
    );
}

import { useState, useMemo } from 'react';
import { Play, TrendingUp, Trophy, ClipboardList, Calendar, Share } from 'lucide-react';
import pkg from '../../package.json';

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
function calculateEstimatedMark(history, progressLog) {
    // Technical Work: 21 marks - based on scales/arpeggios practice (history)
    // Average rating (1-5) maps to 0-21 marks
    const technicalRatings = history.map(h => h.score).filter(s => s > 0);
    const avgTechnical = technicalRatings.length > 0
        ? technicalRatings.reduce((a, b) => a + b, 0) / technicalRatings.length
        : 0;
    const technicalMark = Math.round((avgTechnical / 5) * 21);

    // Pieces: 90 marks (3 pieces × 30 marks each)
    const pieceIds = ['piece_baroque', 'piece_romantic', 'piece_modern'];
    const pieceRatings = pieceIds.map(id => progressLog[id] || 0);
    const pieceMark = pieceRatings.reduce((sum, rating) => sum + Math.round((rating / 5) * 30), 0);

    // Sight-Reading: 21 marks - average of 3 grades
    const srIds = ['sr_grade6', 'sr_grade7', 'sr_grade8'];
    const srRatings = srIds.map(id => progressLog[id] || 0).filter(r => r > 0);
    const avgSR = srRatings.length > 0 ? srRatings.reduce((a, b) => a + b, 0) / srRatings.length : 0;
    const sightReadingMark = Math.round((avgSR / 5) * 21);

    // Aural: 18 marks - average of 4 tests
    const auralIds = ['aural_8a', 'aural_8b', 'aural_8c', 'aural_8d'];
    const auralRatings = auralIds.map(id => progressLog[id] || 0).filter(r => r > 0);
    const avgAural = auralRatings.length > 0 ? auralRatings.reduce((a, b) => a + b, 0) / auralRatings.length : 0;
    const auralMark = Math.round((avgAural / 5) * 18);

    return {
        total: technicalMark + pieceMark + sightReadingMark + auralMark,
        breakdown: {
            pieces: pieceMark,
            technical: technicalMark,
            sightReading: sightReadingMark,
            aural: auralMark
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
export default function DashboardView({ userData, history, progressLog = {}, onStart, onReview, onLogProgress, onUpdateName }) {
    const [isEditingName, setIsEditingName] = useState(false);
    const [editedName, setEditedName] = useState('');

    // Calculate estimated mark
    const { total: estimatedMark, breakdown } = useMemo(() =>
        calculateEstimatedMark(history, progressLog),
        [history, progressLog]
    );

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
Pieces: ${breakdown.pieces}/90
Technical: ${breakdown.technical}/21
Sight-Reading: ${breakdown.sightReading}/21
Aural: ${breakdown.aural}/18

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
        <div className="min-h-screen bg-gray-50 pb-20">
            <header className="bg-white shadow-sm p-6 mb-6">
                <div className="max-w-2xl mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        {/* User Avatar */}
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-indigo-100 flex-shrink-0 border border-gray-800">
                            <img src="/avatar.png" alt="User avatar" className="w-full h-full object-cover" />
                        </div>

                        {/* Editable Name */}
                        <div>
                            {isEditingName ? (
                                <input
                                    type="text"
                                    value={editedName}
                                    onChange={(e) => setEditedName(e.target.value)}
                                    onBlur={handleNameSave}
                                    onKeyDown={handleKeyPress}
                                    autoFocus
                                    className="text-2xl font-bold text-gray-800 border-b-2 border-indigo-500 outline-none bg-transparent px-1"
                                />
                            ) : (
                                <h1
                                    className="text-2xl font-bold text-gray-800 cursor-pointer hover:text-indigo-600 transition-colors"
                                    onClick={handleNameClick}
                                    title="Click to edit name"
                                >
                                    Hi, {name}
                                </h1>
                            )}
                            <p className="text-sm text-gray-500">
                                Ready for your Grade 8 prep?
                                <span className="ml-2 text-xs text-indigo-300 font-mono">v{pkg.version}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2 bg-orange-50 px-3 py-1 rounded-full text-orange-700">
                            <Calendar size={16} />
                            <span className="font-bold">{getDaysUntilExam()} Days</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-indigo-50 px-3 py-1 rounded-full text-indigo-700">
                            <Trophy size={16} />
                            <span className="font-bold">{streaks} Day Streak</span>
                        </div>
                        <button
                            onClick={handleShare}
                            className="p-2 hover:bg-gray-100 rounded-full text-indigo-600 transition-colors"
                            title="Share Progress"
                        >
                            <Share size={20} />
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-2xl mx-auto px-4 space-y-6">
                <button
                    onClick={onReview}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer"
                >
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <h2 className="text-4xl font-bold">{estimatedMark} / 150</h2>
                        </div>
                        <TrendingUp className="text-indigo-200" size={32} />
                    </div>
                    <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                        <div
                            className="bg-white h-full rounded-full transition-all duration-500"
                            style={{ width: `${(estimatedMark / 150) * 100}%` }}
                        ></div>
                    </div>
                    <div className="mt-3 flex justify-between items-center text-sm">
                        <span className={`font-semibold ${color}`}>{grade}</span>
                        <span className="text-indigo-100 text-xs">
                            Pieces: {breakdown.pieces} • Technical: {breakdown.technical} • Sight: {breakdown.sightReading} • Aural: {breakdown.aural}
                        </span>
                    </div>
                </button>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={onStart}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-500 hover:shadow-md transition-all group text-left"
                    >
                        <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors">
                            <Play className="text-indigo-600 group-hover:text-white" fill="currentColor" />
                        </div>
                        <h3 className="font-bold text-gray-800 text-lg">Scales and Arpeggios</h3>
                        <p className="text-sm text-gray-500">4 exercises</p>
                    </button>

                    <button
                        onClick={onLogProgress}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-purple-500 hover:shadow-md transition-all group text-left"
                    >
                        <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors">
                            <ClipboardList className="text-purple-600 group-hover:text-white" />
                        </div>
                        <h3 className="font-bold text-gray-800 text-lg">Log My Progress</h3>
                        <p className="text-sm text-gray-500">Pieces, Aural, Sight-Reading</p>
                    </button>
                </div>

            </div>
        </div>
    );
}

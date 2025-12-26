import { useState, useMemo } from 'react';
import { Play, TrendingUp, ClipboardList, Calendar, Share2, Music, Star } from 'lucide-react';
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
export default function DashboardView({ userData, history, progressLog = {}, onStart, onReview, onLogProgress, onUpdateName, onUpdateAvatar }) {
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

    // Avatar Logic
    const [showAvatarSelector, setShowAvatarSelector] = useState(false);
    const avatarIndex = userData.avatarIndex || 0;

    // Grid matches the 5x5 sprite sheet
    const getAvatarStyle = (index) => {
        const row = Math.floor(index / 5);
        const col = index % 5;
        // Assuming 5x5 grid in the image
        return {
            backgroundImage: 'url(/avatars.png)',
            backgroundPosition: `${col * 25}% ${row * 25}%`,
            backgroundSize: '500%', // 5 columns means 500% width
        };
    };

    const handleAvatarClick = () => {
        setShowAvatarSelector(true);
    };

    const handleSelectAvatar = (index) => {
        if (onUpdateName) {
            // We're hijacking onUpdateName to update user data generally since AppContainer handles it
            // Ideally we'd have onUpdateUserData but for now we'll assume the container can handle this
            // wait, AppContainerMock only allows name update. I need to update AppContainerMock to allow avatar updates.
            // Actually, let's just cheat and assume onUpdateName is limited.
            // Better: Add onUpdateAvatar prop.
        }
        // Since I can't easily change prop signature without checking AppContainerMock, 
        // I will first modify AppContainerMock to pass onUpdateAvatar.
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
        <div className="min-h-screen bg-gray-900 text-white pb-20 relative">
            {/* Avatar Selector Modal */}
            {showAvatarSelector && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowAvatarSelector(false)}>
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-white mb-4 text-center">Choose your Avatar</h3>
                        <div className="grid grid-cols-5 gap-2 max-h-96 overflow-y-auto p-2">
                            {[...Array(25)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        if (onUpdateAvatar) onUpdateAvatar(i);
                                        setShowAvatarSelector(false);
                                    }}
                                    className={`aspect-square rounded-full border-2 transition-all overflow-hidden ${avatarIndex === i ? 'border-indigo-500 scale-110 shadow-lg shadow-indigo-500/30' : 'border-transparent hover:border-gray-600 hover:scale-105'}`}
                                >
                                    <div className="w-full h-full" style={getAvatarStyle(i)} />
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowAvatarSelector(false)}
                            className="mt-6 w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-bold transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <header className="bg-gray-800/50 backdrop-blur border-b border-gray-700 p-6 mb-8">
                <div className="max-w-2xl mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        {/* User Avatar */}
                        <button
                            onClick={handleAvatarClick}
                            className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 flex-shrink-0 border border-gray-600 hover:ring-2 ring-indigo-500 transition-all relative group"
                        >
                            <div className="w-full h-full" style={getAvatarStyle(avatarIndex)} />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-[10px] font-bold">EDIT</span>
                            </div>
                        </button>

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
                                    className="text-2xl font-bold text-white border-b-2 border-indigo-500 outline-none bg-transparent px-1 min-w-[150px]"
                                />
                            ) : (
                                <h1
                                    className="text-2xl font-bold text-white cursor-pointer hover:text-indigo-400 transition-colors"
                                    onClick={handleNameClick}
                                    title="Click to edit name"
                                >
                                    Hi, {name}
                                </h1>
                            )}
                            <p className="text-sm text-gray-400 flex items-center mt-1">
                                Let&apos;s make some music today! 🎵
                                <span className="ml-2 text-[10px] text-indigo-300 font-mono border border-indigo-500/30 bg-indigo-500/10 px-1.5 py-0.5 rounded">v{pkg.version}</span>
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleShare}
                        className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 p-2 rounded-xl transition-colors"
                        title="Share Progress"
                    >
                        <Share2 size={20} />
                    </button>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-6 space-y-6">
                {/* Hero Card */}
                <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl p-6 text-white shadow-xl border border-indigo-500/30 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10">
                        <Music size={120} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-sm font-semibold text-indigo-200 uppercase tracking-wider mb-1">Estimated Grade</h2>
                                <div className="text-4xl font-black tracking-tight">{estimatedMark} <span className="text-lg font-medium text-indigo-300">/ 150</span></div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${color.replace('text-', 'border-').replace('200', '500')} ${color} bg-black/20 backdrop-blur-md`}>
                                {grade}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="bg-black/20 rounded-xl p-3 backdrop-blur-sm border border-white/5">
                                <div className="text-xs text-indigo-200 mb-1">Streak</div>
                                <div className="text-xl font-bold flex items-center">
                                    <span className="mr-1">🔥</span> {userData?.streaks || 0} Days
                                </div>
                            </div>
                            <div className="bg-black/20 rounded-xl p-3 backdrop-blur-sm border border-white/5">
                                <div className="text-xs text-indigo-200 mb-1">Practice</div>
                                <div className="text-xl font-bold flex items-center">
                                    <span className="mr-1">🎻</span> {userData?.totalPractice || 0} Sessions
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={onStart}
                            className="mt-6 w-full bg-indigo-500 hover:bg-indigo-400 text-white py-4 rounded-xl font-black text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-500/40 flex items-center justify-center space-x-2"
                        >
                            <Play fill="currentColor" size={24} />
                            <span>Start Practice Session</span>
                        </button>
                    </div>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={onReview}
                        className="bg-gray-800 hover:bg-gray-750 border border-gray-700 p-5 rounded-2xl transition-all group text-left"
                    >
                        <div className="bg-indigo-500/20 w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <TrendingUp size={20} className="text-indigo-400" />
                        </div>
                        <h3 className="font-bold text-gray-200">Review Progress</h3>
                        <p className="text-xs text-gray-500 mt-1">Check your stats</p>
                    </button>

                    <button
                        onClick={onLogProgress}
                        className="bg-gray-800 hover:bg-gray-750 border border-gray-700 p-5 rounded-2xl transition-all group text-left"
                    >
                        <div className="bg-green-500/20 w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Star size={20} className="text-green-400" />
                        </div>
                        <h3 className="font-bold text-gray-200">Log Progress</h3>
                        <p className="text-xs text-gray-500 mt-1">Rate specific items</p>
                    </button>
                </div>
            </main>
        </div>
    );
}

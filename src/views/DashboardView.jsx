import { useState, useMemo } from 'react';
import { Play, BarChart2, TrendingUp, Trophy, User } from 'lucide-react';
import BALANCE from '@data/balance.json';

/**
 * Dashboard view - main navigation and progress display
 * 
 * @param {Object} props
 * @param {Object} props.userData - User profile data
 * @param {Array} props.history - Practice history entries
 * @param {Function} props.onStart - Start session callback
 * @param {Function} props.onReview - Open review callback
 * @param {Function} props.onUpdateName - Update user name callback
 */
export default function DashboardView({ userData, history, onStart, onReview, onUpdateName }) {
    const [isEditingName, setIsEditingName] = useState(false);
    const [editedName, setEditedName] = useState('');

    // Memoize expensive Set creation (performance optimization)
    const completedIds = useMemo(() =>
        new Set(history.map(h => h.questionId)),
        [history]
    );

    const totalQuestions = BALANCE.questions.totalCount; // 42
    const progress = Math.round((completedIds.size / totalQuestions) * 100);

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
                            <p className="text-sm text-gray-500">Ready for your Grade 8 prep?</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 bg-indigo-50 px-3 py-1 rounded-full text-indigo-700">
                        <Trophy size={16} />
                        <span className="font-bold">{streaks} Day Streak</span>
                    </div>
                </div>
            </header>

            <div className="max-w-2xl mx-auto px-4 space-y-6">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <p className="text-indigo-100 font-medium">Syllabus Coverage</p>
                            <h2 className="text-4xl font-bold">{progress}%</h2>
                        </div>
                        <TrendingUp className="text-indigo-200" size={32} />
                    </div>
                    <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                        <div
                            className="bg-white h-full rounded-full"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <div className="mt-2 text-sm text-indigo-100 flex justify-between">
                        <span>{completedIds.size} / {totalQuestions} items mastered</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <button
                        onClick={onReview}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-500 hover:shadow-md transition-all group text-left"
                    >
                        <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors">
                            <BarChart2 className="text-indigo-600 group-hover:text-white" />
                        </div>
                        <h3 className="font-bold text-gray-800 text-lg">Review Progress</h3>
                        <p className="text-sm text-gray-500">Track your grades & history</p>
                    </button>
                </div>

            </div>
        </div>
    );
}

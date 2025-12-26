import { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, Music, Eye, Headphones, Star, HelpCircle } from 'lucide-react';
import StarRating from '@components/StarRating';

/**
 * Progress Log View - allows users to rate their progress on various Grade 8 exam components
 * Shows all items in a flat grid layout for quick access
 */

// ABRSM Marking Criteria for self-assessment reference
const MARKING_CRITERIA = {
    pieces: {
        title: 'Pieces Marking Criteria (out of 30)',
        grades: [
            { grade: 'Distinction', marks: '27-30', stars: 5, criteria: ['Highly accurate notes and intonation', 'Fluent, with flexibility where appropriate', 'Well projected, sensitive use of tonal qualities', 'Expressive, idiomatic musical shaping', 'Assured, fully committed performance'] },
            { grade: 'Merit', marks: '24-26', stars: 4, criteria: ['Largely accurate notes and intonation', 'Sustained, effective tempo with good rhythm', 'Mainly controlled and consistent tone', 'Clear musical shaping, well-realised detail', 'Positive, carrying musical conviction'] },
            { grade: 'Pass', marks: '20-23', stars: 3, criteria: ['Generally correct notes', 'Suitable tempo, generally stable pulse', 'Generally reliable, adequate tonal awareness', 'Some realisation of musical shape/detail', 'Generally secure, prompt recovery from slips'] },
            { grade: 'Below Pass', marks: '17-19', stars: 2, criteria: ['Frequent note errors', 'Unsuitable/uncontrolled tempo, irregular pulse', 'Uneven/unreliable, inadequate tonal awareness', 'Musical shape insufficiently conveyed', 'Insecure, insufficient musical involvement'] },
            { grade: 'Needs Work', marks: '13-16', stars: 1, criteria: ['Largely inaccurate notes/intonation', 'Erratic tempo and/or pulse', 'Serious lack of tonal control', 'Musical shape largely unrealised', 'Lacking continuity, no musical involvement'] },
        ]
    },
    sight_reading: {
        title: 'Sight-Reading Criteria (out of 21)',
        grades: [
            { grade: 'Distinction', marks: '19-21', stars: 5, criteria: ['Fluent, rhythmically accurate', 'Accurate notes/pitch/key', 'Musical detail realised', 'Confident presentation'] },
            { grade: 'Merit', marks: '17-18', stars: 4, criteria: ['Adequate tempo, usually steady pulse', 'Mainly correct rhythm', 'Largely correct notes/pitch/key', 'Largely secure presentation'] },
            { grade: 'Pass', marks: '14-16', stars: 3, criteria: ['Continuity generally maintained', 'Note values mostly realised', 'Pitch outlines in place, despite errors', 'Cautious presentation'] },
            { grade: 'Below Pass', marks: '11-13', stars: 2, criteria: ['Lacking overall continuity', 'Incorrect note values', 'Very approximate notes/pitch/key', 'Insecure presentation'] },
            { grade: 'Needs Work', marks: '7-10', stars: 1, criteria: ['No continuity or incomplete', 'Note values unrealised', 'Pitch outlines absent', 'Very uncertain presentation'] },
        ]
    },
    aural: {
        title: 'Aural Tests Criteria (out of 18)',
        grades: [
            { grade: 'Distinction', marks: '17-18', stars: 5, criteria: ['Accurate throughout', 'Musically perceptive', 'Confident response'] },
            { grade: 'Merit', marks: '15-16', stars: 4, criteria: ['Strengths significantly outweigh weaknesses', 'Musically aware', 'Secure response'] },
            { grade: 'Pass', marks: '12-14', stars: 3, criteria: ['Strengths just outweigh weaknesses', 'Cautious response'] },
            { grade: 'Below Pass', marks: '9-11', stars: 2, criteria: ['Weaknesses outweigh strengths', 'Uncertain response'] },
            { grade: 'Needs Work', marks: '6-8', stars: 1, criteria: ['Inaccuracy throughout', 'Vague response'] },
        ]
    }
};

const PROGRESS_CATEGORIES = [
    {
        id: 'pieces',
        title: 'Pieces',
        marks: 90,
        icon: Music,
        color: 'indigo',
        criteriaKey: 'pieces',
        items: [
            { id: 'piece_baroque', label: 'List A', subtitle: 'Baroque/Classical' },
            { id: 'piece_romantic', label: 'List B', subtitle: 'Romantic' },
            { id: 'piece_modern', label: 'List C', subtitle: 'Modern' },
        ]
    },
    {
        id: 'sight_reading',
        title: 'Sight-Reading',
        marks: 21,
        icon: Eye,
        color: 'emerald',
        criteriaKey: 'sight_reading',
        items: [
            { id: 'sr_grade6', label: 'Grade 6', subtitle: 'Sight-Reading' },
            { id: 'sr_grade7', label: 'Grade 7', subtitle: 'Sight-Reading' },
            { id: 'sr_grade8', label: 'Grade 8', subtitle: 'Sight-Reading' },
        ]
    },
    {
        id: 'aural',
        title: 'Aural',
        marks: 18,
        icon: Headphones,
        color: 'purple',
        criteriaKey: 'aural',
        items: [
            { id: 'aural_8a', label: '8A', subtitle: 'Cadences & Chords' },
            { id: 'aural_8b', label: '8B', subtitle: 'Sight-Singing' },
            { id: 'aural_8c', label: '8C', subtitle: 'Modulation' },
            { id: 'aural_8d', label: '8D', subtitle: 'Musical Features' },
        ]
    }
];

// Marking Criteria Panel Component
function MarkingCriteriaPanel({ criteriaKey, isOpen, onToggle }) {
    const criteria = MARKING_CRITERIA[criteriaKey];
    if (!criteria) return null;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <button
                onClick={onToggle}
                className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
            >
                <div className="flex items-center space-x-2">
                    <HelpCircle size={18} className="text-indigo-500" />
                    <span className="font-medium text-gray-700 text-sm">How should I rate myself?</span>
                </div>
                {isOpen ? <ChevronUp size={18} className="text-gray-500" /> : <ChevronDown size={18} className="text-gray-500" />}
            </button>

            {isOpen && (
                <div className="px-4 py-3 space-y-3 max-h-80 overflow-y-auto">
                    <p className="text-xs text-gray-500 font-medium">{criteria.title}</p>
                    {criteria.grades.map((grade, idx) => (
                        <div key={idx} className={`p-3 rounded-lg ${grade.stars >= 4 ? 'bg-green-50 border border-green-200' : grade.stars === 3 ? 'bg-yellow-50 border border-yellow-200' : 'bg-red-50 border border-red-200'}`}>
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-semibold text-gray-800 text-sm">{grade.grade}</span>
                                <div className="flex items-center space-x-2">
                                    <span className="text-xs text-gray-500">{grade.marks}</span>
                                    <span className="text-yellow-500">{'★'.repeat(grade.stars)}</span>
                                </div>
                            </div>
                            <ul className="text-xs text-gray-600 space-y-0.5">
                                {grade.criteria.map((c, i) => (
                                    <li key={i}>• {c}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// Star display for grid items - always shows 5 stars
function StarDisplay({ rating }) {
    return (
        <div className="flex justify-center">
            {[1, 2, 3, 4, 5].map(s => (
                <Star
                    key={s}
                    size={12}
                    className={s <= rating ? 'text-yellow-400' : 'text-gray-300'}
                    fill={s <= rating ? 'currentColor' : 'none'}
                />
            ))}
        </div>
    );
}

export default function ProgressLogView({ onBack, onLogProgress, progressLog = {} }) {
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [rating, setRating] = useState(0);
    const [showCriteria, setShowCriteria] = useState(true); // Open by default

    const savedItems = progressLog;

    const handleSelectItem = (item, category) => {
        setSelectedItem(item);
        setSelectedCategory(category);
        setRating(savedItems[item.id] || 0);
        // Keep criteria panel open by default
    };

    const handleSaveRating = () => {
        if (selectedItem && rating > 0) {
            if (onLogProgress) {
                onLogProgress({
                    itemId: selectedItem.id,
                    label: selectedItem.label,
                    rating: rating,
                    timestamp: new Date().toISOString()
                });
            }
            setSelectedItem(null);
            setSelectedCategory(null);
            setRating(0);
            setShowCriteria(false);
        }
    };

    const colorClasses = {
        indigo: {
            bg: 'bg-indigo-100',
            bgDark: 'bg-indigo-600',
            text: 'text-indigo-600',
            border: 'border-indigo-200',
            borderHover: 'hover:border-indigo-400',
            gradient: 'from-indigo-600 to-indigo-700'
        },
        emerald: {
            bg: 'bg-emerald-100',
            bgDark: 'bg-emerald-600',
            text: 'text-emerald-600',
            border: 'border-emerald-200',
            borderHover: 'hover:border-emerald-400',
            gradient: 'from-emerald-600 to-emerald-700'
        },
        purple: {
            bg: 'bg-purple-100',
            bgDark: 'bg-purple-600',
            text: 'text-purple-600',
            border: 'border-purple-200',
            borderHover: 'hover:border-purple-400',
            gradient: 'from-purple-600 to-purple-700'
        }
    };

    // Rating modal
    if (selectedItem) {
        const colors = colorClasses[selectedCategory?.color || 'indigo'];

        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <header className="bg-white shadow-sm p-4">
                    <div className="max-w-2xl mx-auto flex items-center">
                        <button
                            onClick={() => { setSelectedItem(null); setRating(0); }}
                            className="p-2 -ml-2 text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <h1 className="text-xl font-bold text-gray-800 ml-2">Rate Your Progress</h1>
                    </div>
                </header>

                <div className="flex-1 flex flex-col items-center px-4 py-6 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full text-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800 mb-1">{selectedItem.label}</h2>
                        <p className="text-gray-500 text-sm mb-6">{selectedItem.subtitle}</p>

                        <StarRating rating={rating} setRating={setRating} />

                        <button
                            onClick={handleSaveRating}
                            disabled={rating === 0}
                            className={`mt-6 w-full py-3 px-6 rounded-xl font-semibold text-white transition-all ${rating > 0
                                ? `bg-gradient-to-r ${colors.gradient} hover:shadow-lg`
                                : 'bg-gray-300 cursor-not-allowed'
                                }`}
                        >
                            Save Rating
                        </button>
                    </div>

                    {/* Marking Criteria Reference */}
                    <div className="max-w-md w-full">
                        <MarkingCriteriaPanel
                            criteriaKey={selectedCategory?.criteriaKey}
                            isOpen={showCriteria}
                            onToggle={() => setShowCriteria(!showCriteria)}
                        />
                    </div>
                </div>
            </div>
        );
    }

    // Main grid view - all items visible
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm p-4 select-none">
                <div className="max-w-2xl mx-auto flex items-center">
                    <button
                        onClick={onBack}
                        className="p-2 -ml-2 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800 ml-2">Log My Progress</h1>
                </div>
            </header>

            <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
                {PROGRESS_CATEGORIES.map((category) => {
                    const Icon = category.icon;
                    const colors = colorClasses[category.color];

                    return (
                        <div key={category.id}>
                            {/* Category Header */}
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-2">
                                    <div className={`${colors.bg} p-1.5 rounded-lg`}>
                                        <Icon className={colors.text} size={16} />
                                    </div>
                                    <h3 className="font-semibold text-gray-700">{category.title}</h3>
                                    <span className="text-xs text-gray-400">({category.marks} marks)</span>
                                </div>
                            </div>

                            {/* Items Grid */}
                            <div className="grid grid-cols-3 gap-3">
                                {category.items.map((item) => {
                                    const itemRating = savedItems[item.id] || 0;
                                    const isMastered = itemRating >= 4;

                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => handleSelectItem(item, category)}
                                            className={`bg-white p-4 rounded-xl shadow-sm border ${colors.border} ${colors.borderHover} hover:shadow-md transition-all text-center ${isMastered ? 'ring-2 ring-green-400 ring-opacity-50' : ''}`}
                                        >
                                            <p className={`font-bold text-lg ${isMastered ? 'text-green-600' : 'text-gray-800'}`}>
                                                {item.label}
                                            </p>
                                            <p className="text-xs text-gray-500 mb-2 truncate">
                                                {item.subtitle}
                                            </p>
                                            <StarDisplay rating={itemRating} />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

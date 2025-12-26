import { useState } from 'react';
import { Music } from 'lucide-react';

/**
 * Onboarding view - name input for new users
 * 
 * @param {Object} props
 * @param {Function} props.onSave - Callback with user name
 */
export default function OnboardingView({ onSave }) {
    const [name, setName] = useState('');

    const handleSave = () => {
        if (name.trim()) {
            onSave(name);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-700">
                <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                <div className="p-8">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 text-3xl transform -rotate-3">
                            🎻
                        </div>
                    </div>

                    <h1 className="text-3xl font-black text-center text-white mb-2">Virtuoso 8</h1>
                    <p className="text-center text-gray-400 mb-8">
                        Master your Grade 8 Scales with daily practice.
                    </p>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-2 ml-1">What should we call you?</label>
                            <input
                                type="text"
                                placeholder="Your Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white placeholder-gray-600"
                                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                            />
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={!name.trim()}
                            className="w-full bg-indigo-500 hover:bg-indigo-400 text-white py-4 rounded-xl font-black text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/40"
                        >
                            Start Practice
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

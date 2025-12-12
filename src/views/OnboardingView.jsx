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

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-indigo-50 p-6">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
                <Music className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Virtuoso 8</h1>
                <p className="text-gray-600 mb-6">Grade 8 Violin Scale Trainer</p>
                <input
                    type="text"
                    placeholder="What should we call you?"
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button
                    onClick={() => onSave(name)}
                    disabled={!name.trim()}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                    Start Practicing
                </button>
            </div>
        </div>
    );
}

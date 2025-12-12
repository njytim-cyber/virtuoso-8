import { CheckCircle } from 'lucide-react';

/**
 * Session complete view
 * 
 * @param {Object} props
 * @param {Function} props.onBack - Return to dashboard callback
 */
export default function CompleteView({ onBack }) {
    return (
        <div className="min-h-screen bg-indigo-900 flex flex-col items-center justify-center p-6 text-white text-center">
            <CheckCircle size={80} className="text-green-400 mb-6" />
            <h2 className="text-3xl font-bold mb-2">Session Complete!</h2>
            <p className="text-indigo-200 mb-8">Excellent work. Your stats have been updated.</p>
            <button
                onClick={onBack}
                className="bg-white text-indigo-900 px-8 py-3 rounded-full font-bold hover:bg-indigo-50 transition-colors"
            >
                Back to Dashboard
            </button>
        </div>
    );
}

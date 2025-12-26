import { useState, useEffect } from 'react';
import { generateSession } from '@utils/sessionGenerator';
import OnboardingView from '@views/OnboardingView';
import DashboardView from '@views/DashboardView';
import SessionContainer from './SessionContainer';
import CompleteView from '@views/CompleteView';
import ReviewView from '@views/ReviewView';
import ProgressLogView from '@views/ProgressLogView';

/**
 * Mock Application Container - Works without Firebase
 * Uses localStorage for persistence
 */
export default function AppContainerMock() {
    const [userData, setUserData] = useState(() => {
        const saved = localStorage.getItem('virtuoso8_userData');
        return saved ? JSON.parse(saved) : null;
    });

    const [history, setHistory] = useState(() => {
        const saved = localStorage.getItem('virtuoso8_history');
        return saved ? JSON.parse(saved) : [];
    });

    const [progressLog, setProgressLog] = useState(() => {
        const saved = localStorage.getItem('virtuoso8_progressLog');
        return saved ? JSON.parse(saved) : {};
    });

    const [view, setView] = useState(() => userData ? 'dashboard' : 'onboarding');
    const [sessionQueue, setSessionQueue] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Persist to localStorage
    useEffect(() => {
        if (userData) {
            localStorage.setItem('virtuoso8_userData', JSON.stringify(userData));
        }
    }, [userData]);

    useEffect(() => {
        localStorage.setItem('virtuoso8_history', JSON.stringify(history));
    }, [history]);

    useEffect(() => {
        localStorage.setItem('virtuoso8_progressLog', JSON.stringify(progressLog));
    }, [progressLog]);

    const handleCreateProfile = (name) => {
        if (!name.trim()) return;

        const initialData = {
            name: name,
            streaks: 0,
            lastLogin: new Date().toDateString(),
            totalPractice: 0,
            tutorialSeen: false
        };

        setUserData(initialData);
        setView('dashboard');
    };

    const handleStartSession = () => {
        const session = generateSession(history);
        setSessionQueue(session);
        setCurrentIndex(0);
        setView('session');

        // Mark tutorial as seen
        if (!userData.tutorialSeen) {
            setUserData(prev => ({ ...prev, tutorialSeen: true }));
        }
    };

    const submitRating = (rating) => {
        const currentQ = sessionQueue[currentIndex];

        // Add to history
        const newEntry = {
            id: `${Date.now()}_${Math.random()}`,
            questionId: currentQ.id,
            score: rating,
            variant: currentQ.variant,
            timestamp: new Date().toISOString(),
            dateString: new Date().toDateString()
        };

        setHistory(prev => [...prev, newEntry]);

        // Update user stats
        const isNewDay = userData.lastLogin !== new Date().toDateString();
        setUserData(prev => ({
            ...prev,
            lastLogin: new Date().toDateString(),
            streaks: isNewDay ? (prev.streaks || 0) + 1 : (prev.streaks || 0),
            totalPractice: (prev.totalPractice || 0) + 1
        }));

        if (currentIndex < 3) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setView('complete');
        }
    };

    const handleUpdateName = (newName) => {
        setUserData(prev => ({ ...prev, name: newName }));
    };

    const handleLogProgress = (entry) => {
        setProgressLog(prev => ({ ...prev, [entry.itemId]: entry.rating }));
    };

    // View Routing
    switch (view) {
        case 'onboarding':
            return <OnboardingView onSave={handleCreateProfile} />;
        case 'dashboard':
            return <DashboardView userData={userData} history={history} progressLog={progressLog} onStart={handleStartSession} onReview={() => setView('review')} onLogProgress={() => setView('progressLog')} onUpdateName={handleUpdateName} />;
        case 'progressLog':
            return <ProgressLogView progressLog={progressLog} onBack={() => setView('dashboard')} onLogProgress={handleLogProgress} />;
        case 'session':
            return <SessionContainer queue={sessionQueue} index={currentIndex} onRate={submitRating} userData={userData} history={history} onBack={() => setView('dashboard')} />;
        case 'complete':
            return <CompleteView onBack={() => setView('dashboard')} />;
        case 'review':
            return <ReviewView history={history} progressLog={progressLog} userData={userData} onBack={() => setView('dashboard')} />;
        default:
            return <DashboardView userData={userData} history={history} progressLog={progressLog} onStart={handleStartSession} onReview={() => setView('review')} onLogProgress={() => setView('progressLog')} onUpdateName={handleUpdateName} />;
    }
}

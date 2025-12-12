import { QUESTIONS } from '@data/questions';

/**
 * Generates a practice session of 4 questions (one from each category)
 * with weighted random selection favoring unplayed questions
 * 
 * @param {Array} history - Array of history entries with questionId
 * @returns {Array} Array of 4 questions with variant bowing assigned
 */
export const generateSession = (history) => {
    /**
     * Gets a weighted random question from a category
     * Prioritizes unplayed questions, falls back to random if all played
     */
    const getWeightedRandom = (category) => {
        const catQuestions = QUESTIONS.filter(q => q.cat === category);
        const unplayed = catQuestions.filter(q => !history.find(h => h.questionId === q.id));

        if (unplayed.length > 0) {
            return unplayed[Math.floor(Math.random() * unplayed.length)];
        }
        return catQuestions[Math.floor(Math.random() * catQuestions.length)];
    };

    const session = [
        getWeightedRandom('Scales'),
        getWeightedRandom('Arpeggios'),
        getWeightedRandom('Misc'),
        getWeightedRandom('DoubleStops')
    ];

    // Assign bowing variants
    const sessionWithBowing = session.map(q => {
        let variant = 'Separate Bows';
        if (q.bow === 'both') {
            variant = Math.random() > 0.5 ? 'Separate Bows' : 'Slurred';
        } else if (q.bow === 'slurred') {
            variant = 'Slurred';
        } else if (q.bow === 'broken_steps') {
            variant = 'Slurred pairs + separate';
        }
        return { ...q, variant };
    });

    return sessionWithBowing;
};

/**
 * Formatting utilities for question titles and music notation
 */

/**
 * Formats question title with octave info on separate line
 * @param {string} title - Question title
 * @returns {JSX.Element} Formatted title element
 */
export const formatTitle = (title) => {
    if (title.includes('(')) {
        const [name, info] = title.split('(');
        const cleanInfo = info.replace(')', '').replace(/Oct\b/g, 'Octaves');
        return (
            <div className="flex flex-col items-center">
                <span className="block">{name.trim()}</span>
                <span className="block text-xl mt-1 text-gray-400 font-normal">({cleanInfo})</span>
            </div>
        );
    }
    return <span>{title}</span>;
};

/**
 * Returns musical note symbol based on beat unit
 * @param {number} beatUnit - Beat unit value (0.5, 1, or 1.5)
 * @returns {string} Musical note symbol
 */
export const getNoteSymbol = (beatUnit) => {
    if (beatUnit === 0.5) return '♪';
    if (beatUnit === 1) return '♩';
    if (beatUnit === 1.5) return '♩.';
    return '♩';
};

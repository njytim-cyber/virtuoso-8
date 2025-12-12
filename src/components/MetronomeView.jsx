/**
 * Visual metronome beat indicators
 * 
 * @param {Object} props
 * @param {number} props.count - Current beat number (1-based)
 * @param {string} props.timeSig - Time signature ('4/4', '6/8', '9/8')
 */
export default function MetronomeView({ count, timeSig }) {
    const Circle = ({ num }) => {
        const isActive = count === num;

        let classes = "w-6 h-6 rounded-full transition-all duration-150 transform ";

        if (isActive) {
            // Active beat: bright green with glow
            classes += "bg-green-400 scale-125 shadow-lg shadow-green-400/50";
        } else {
            // Inactive beats: grey
            classes += "bg-gray-700";
        }

        return <div className={classes} />;
    };

    return (
        <div className="flex justify-center gap-6 my-6 h-10 items-center">
            <Circle num={1} />
            <Circle num={2} />
            <Circle num={3} />
            {['4/4', '6/8'].includes(timeSig) && <Circle num={4} />}
            {timeSig === '6/8' && (
                <>
                    <Circle num={5} />
                    <Circle num={6} />
                </>
            )}
        </div>
    );
}

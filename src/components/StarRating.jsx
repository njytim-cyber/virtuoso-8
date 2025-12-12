import { Star } from 'lucide-react';

/**
 * Star rating widget - allows user to rate their performance
 * 
 * @param {Object} props
 * @param {number} props.rating - Current rating (0-5)
 * @param {Function} props.setRating - Function to update rating
 * @param {Function} props.onRate - Optional callback when rating is set
 */
export default function StarRating({ rating, setRating, onRate }) {
    const getRatingLabel = (score) => {
        if (score === 0) return "Rate your performance";
        if (score === 5) return "Perfect!";
        if (score === 4) return "Very Good";
        if (score === 3) return "Passable";
        if (score === 2) return "Needs Work";
        return "Try Again";
    };

    return (
        <div className="flex flex-col items-center space-y-3">
            <div className="flex space-x-3">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => {
                            setRating(star);
                            if (onRate) onRate(star);
                        }}
                        className="transition-all duration-200 hover:scale-110 focus:outline-none"
                        type="button"
                    >
                        <Star
                            size={42}
                            className={`${rating >= star ? 'fill-yellow-400 text-yellow-400 drop-shadow-md' : 'text-gray-600'}`}
                        />
                    </button>
                ))}
            </div>
            <p className="text-lg font-medium text-gray-300 min-h-[1.75rem]">
                {getRatingLabel(rating)}
            </p>
        </div>
    );
}

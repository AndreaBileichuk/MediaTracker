import { useState } from "react";
import { Star, X } from "lucide-react";
import styles from "./../MediaItemDetails.module.css";

interface RatingSelectorProps {
    currentRating: number | null;
    onRate: (rating: number) => void;
    onClose: () => void;
    isLoading?: boolean;
}

const RatingSelector = ({ currentRating, onRate, onClose, isLoading }: RatingSelectorProps) => {
    const [hoverRating, setHoverRating] = useState<number | null>(null);

    const stars = Array.from({ length: 10 }, (_, i) => i + 1);

    const displayRating = hoverRating ?? currentRating ?? 0;

    return (
        <div className={styles.popover}>
            <div className={styles.header}>
                <span>Rate this title</span>
                <button onClick={onClose} className={styles.closeBtn}><X size={14} /></button>
            </div>

            <div className={styles.starRow}>
                {stars.map((starValue) => (
                    <button
                        key={starValue}
                        type="button"
                        className={styles.starBtn}
                        onMouseEnter={() => setHoverRating(starValue)}
                        onMouseLeave={() => setHoverRating(null)}
                        onClick={() => onRate(starValue)}
                        disabled={isLoading}
                    >
                        <Star
                            size={20}
                            className={starValue <= displayRating ? styles.filled : styles.empty}
                            fill={starValue <= displayRating ? "gold" : "none"}
                        />
                    </button>
                ))}
            </div>

            <div className={styles.ratingLabel}>
                {displayRating > 0 ? `${displayRating} / 10` : "Select a rating"}
            </div>
        </div>
    );
};

export default RatingSelector;
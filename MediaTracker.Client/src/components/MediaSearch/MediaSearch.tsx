import { useRef, useState} from "react";
import styles from "./MediaSearch.module.css";

function MediaSearch() {
    const [media, setMedia] = useState(null);
    const input = useRef(null);

    const PLACEHOLDER_IMG = "https://placehold.co/220x330?text=No+Image";

    function handleSearchClick() {
        if (!input.current?.value) return;

        fetch(`https://localhost:7283/media?query=${input.current?.value}&type=movie`)
            .then(json => json.json())
            .then(data => setMedia(data))
            .catch(err => console.error("API Error:", err));
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') handleSearchClick();
    }

    function handleChange() {
        handleSearchClick();
    }

    // 2. Helper to swap image source if the link is broken (404)
    const handleImageError = (e) => {
        e.target.onerror = null; // Prevents infinite loop
        e.target.src = PLACEHOLDER_IMG;
    };

    return (
        <div className={styles.container}>
            <div className={styles.searchBox}>
                <input
                    type="text"
                    ref={input}
                    className={styles.input}
                    placeholder="Search for movies..."
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                />
                <button onClick={handleSearchClick} className={styles.button}>
                    Search
                </button>
            </div>

            <ul className={styles.grid}>
                {media?.map(m => (
                    <li key={m.id} className={styles.card}>

                        {/* 3. Improved Image Tag with onError */}
                        <img
                            src={m.posterPath ?? PLACEHOLDER_IMG}
                            alt={m.title}
                            className={styles.poster}
                            onError={handleImageError}
                        />

                        <div className={styles.content}>
                            <h3 className={styles.title}>{m.title}</h3>

                            <p className={styles.overview}>
                                {m.overview ?? "No description available."}
                            </p>

                            <div className={styles.meta}>
                                <span>
                                    {m.releaseDate
                                        ? m.releaseDate.split('T')[0]
                                        : "Unknown Date"
                                    }
                                </span>

                                {m.isAdult && (
                                    <span className={styles.badge} style={{color: 'red'}}>
                                        18+
                                    </span>
                                )}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            {media && media.length === 0 && (
                <p style={{textAlign: 'center', color: '#666'}}>No results found.</p>
            )}
        </div>
    );
}

export default MediaSearch;
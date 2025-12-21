import React, { useRef, useState } from "react";
import styles from "./MediaSearch.module.css";
import { mediaApi, type ProvidedMedia } from "../../api/mediaApi.ts";
import { Outlet } from "react-router-dom";
import MediaCard from "./MediaCard.tsx";


function MediaSearch() {
    const [media, setMedia] = useState<ProvidedMedia[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const input = useRef<HTMLInputElement>(null);

    async function handleSearch() {
        if (!input.current?.value) return;

        try {
            setIsLoading(true);

            const response = await mediaApi.searchMedia(input.current.value, "movie");
            const result = response.data;

            if (!result.isSuccess || !result.data) {
                // Ideally toast, simplified for now
                alert("Something went wrong");
                setMedia(null);
                return;
            }

            setMedia(result.data);
        }
        catch (error) {
            console.error("Network error:", error);
        }
        finally {
            setIsLoading(false);
        }
    }

    async function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') await handleSearch();
    }

    return (
        <div className={styles.container}>
            <div className={styles.searchBox}>
                <input
                    type="text"
                    ref={input}
                    className={styles.input}
                    placeholder="Search for movies..."
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                />
                <button
                    onClick={handleSearch}
                    className={styles.button}
                    disabled={isLoading}
                >
                    {isLoading ? "Searching..." : "Search"}
                </button>
            </div>

            {isLoading && <div className={styles.loader}>Searching...</div>}

            <ul className={styles.grid}>
                {media?.map(m => (
                    <MediaCard media={m} key={m.id} />
                ))}
            </ul>

            {!isLoading && media && media.length === 0 && (
                <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>No results found.</p>
            )}

            <Outlet />
        </div>
    );
}

export default MediaSearch;
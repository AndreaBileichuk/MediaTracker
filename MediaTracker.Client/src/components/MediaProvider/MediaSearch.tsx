import React, {useEffect, useState} from "react";
import styles from "./MediaProvider.module.css";
import {mediaApi, type MediaApiResponse} from "../../api/mediaApi.ts";
import {Outlet} from "react-router-dom";
import MediaList from "./common/MediaList.tsx";
import Pagination from "../common/Pagination/Pagination.tsx";

function MediaSearch() {
    const [media, setMedia] = useState<MediaApiResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const [inputValue, setInputValue] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    async function fetchMedia(queryToFetch: string, page: number) {
        if (!queryToFetch) return;

        try {
            setIsLoading(true);

            const response = await mediaApi.searchMedia(queryToFetch, "movie", page);
            const result = response.data;

            if (!result.isSuccess || !result.data) {
                setMedia(null);
                return;
            }

            setMedia(result.data);
        } catch (error) {
            console.error("Network error:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (!searchQuery) return;
        fetchMedia(searchQuery, currentPage);
    }, [searchQuery, currentPage]);

    function handleSearch() {
        if (!inputValue.trim()) return;

        setSearchQuery(inputValue);
        setCurrentPage(1);
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') handleSearch();
    }

    const showNoResults = !isLoading && media && media.results.length === 0 && searchQuery;

    return (
        <div className={styles.container}>
            <div className={styles.searchBox}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={styles.input}
                    placeholder="Search for movies..."
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

            {showNoResults && (
                <p style={{textAlign: 'center', color: '#666', marginTop: '20px'}}>No results found.</p>
            )}

            {
                (media && media.results && media.results.length > 0) &&
                (
                    <>
                        <MediaList mediaList={media.results}/>

                        <Pagination
                            totalPages={media.totalPages}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                        />
                    </>
                )
            }

            <Outlet/>
        </div>
    );
}

export default MediaSearch;
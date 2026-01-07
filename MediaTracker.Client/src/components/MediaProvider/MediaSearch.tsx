import React, {useEffect, useState} from "react";
import styles from "./MediaProvider.module.css";
import {mediaProviderApi, type MediaApiResponse, type MediaType} from "../../api/mediaProviderApi.ts";
import {Outlet} from "react-router-dom";
import MediaList from "./common/MediaList.tsx";
import Pagination from "../common/Pagination/Pagination.tsx";
import RedCustomBtn from "../common/CustomButtons/RedCustomBtn.tsx";
import type {BackendResult} from "../../api/types.ts";
import type {AxiosError} from "axios";

function MediaSearch() {
    const [media, setMedia] = useState<MediaApiResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const [type, setType] = useState<MediaType>("series");

    const [inputValue, setInputValue] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    async function fetchMedia(queryToFetch: string, page: number, mediaType: MediaType) {
        if (!queryToFetch) return;

        try {
            setIsLoading(true);

            const response = await mediaProviderApi.searchMedia(queryToFetch, mediaType, page);
            const result = response.data;

            if (!result.isSuccess || !result.data) {
                setMedia(null);
                return;
            }

            setMedia(result.data);
        } catch (e) {
            const error = e as AxiosError<BackendResult<MediaApiResponse>>;
            console.error("Network error:", error);
        } finally {
            setIsLoading(false);
        }
    }

    // 2. Add 'type' to dependency array so it refetches automatically when switched
    useEffect(() => {
        if (!searchQuery) return;
        fetchMedia(searchQuery, currentPage, type);
    }, [searchQuery, currentPage, type]);

    function handleSearch() {
        if (!inputValue.trim()) return;
        setSearchQuery(inputValue);
        setCurrentPage(1);
    }

    function handleTypeChange(newType: MediaType) {
        if (type === newType) return;
        setType(newType);
        setCurrentPage(1);
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') handleSearch();
    }

    const showNoResults = !isLoading && media && media.results.length === 0 && searchQuery;

    return (
        <div className={styles.container}>
            <div className={styles.typeSelector} style={{ marginBottom: '1rem', display: 'flex', gap: '10px' }}>
                <button
                    onClick={() => handleTypeChange("movie")}
                    className={type === "movie" ? styles.activeTypeBtn : styles.inactiveTypeBtn}
                    style={{
                        fontWeight: type === "movie" ? 'bold' : 'normal',
                        textDecoration: type === "movie" ? 'underline' : 'none',
                        cursor: 'pointer',
                        background: 'none',
                        border: 'none',
                        color: type === "movie" ? '#E50914' : '#fff' // Assuming Netflix-ish red/white theme
                    }}
                >
                    Movies
                </button>
                <button
                    onClick={() => handleTypeChange("series")}
                    className={type === "series" ? styles.activeTypeBtn : styles.inactiveTypeBtn}
                    style={{
                        fontWeight: type === "series" ? 'bold' : 'normal',
                        textDecoration: type === "series" ? 'underline' : 'none',
                        cursor: 'pointer',
                        background: 'none',
                        border: 'none',
                        color: type === "series" ? '#E50914' : '#fff'
                    }}
                >
                    TV Series
                </button>
            </div>

            <div className={styles.searchBox}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={styles.input}
                    placeholder={`Search for ${type === 'movie' ? 'movies' : 'TV series'}...`}
                    disabled={isLoading}
                />

                <RedCustomBtn
                    isLoading={isLoading}
                    text={"Search"}
                    onClick={handleSearch}
                />
            </div>

            {isLoading && <div className={styles.loader}>Searching...</div>}

            {showNoResults && (
                <p style={{textAlign: 'center', color: '#666', marginTop: '20px'}}>No results found.</p>
            )}

            {(media && media.results && media.results.length > 0) &&
                <>
                    <MediaList mediaList={media.results} type={type}/>

                    <Pagination
                        totalPages={media.totalPages}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                </>
            }

            <Outlet/>
        </div>
    );
}

export default MediaSearch;
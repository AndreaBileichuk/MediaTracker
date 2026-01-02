import { useParams, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import s from "../MediaProvider.module.css";
import { mediaProviderApi, type ProvidedMediaDetails } from "../../../api/mediaProviderApi.ts";
import { Calendar, Clock, Star, X } from "lucide-react";
import {type MediaItem, myMediaApi} from "../../../api/myMediaApi.ts";
import { toast } from "react-toastify";
import axios, {type AxiosError} from "axios";
import type {BackendResult} from "../../../api/types.ts";

function MediaDetails() {
    const { id } = useParams<{ id: string }>();
    const [detailedMediaInfo, setDetailedMediaInfo] = useState<ProvidedMediaDetails | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleClose = useCallback(() => {
        navigate("..");
    }, [navigate])

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleClose();
        };

        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [handleClose]);

    useEffect(() => {
        if (!id) return;

        const fetchMedia = async () => {
            try {
                setIsLoading(true);
                const response = await mediaProviderApi.getMediaById(Number(id), "movie");
                const result = response.data

                if (!result.isSuccess || !result.data) {
                    // Ideally toast or snackbar, but alert for now as per original or silence
                    console.error("Failed to load media details");
                    setDetailedMediaInfo(null);
                    return;
                }

                setDetailedMediaInfo(result.data);
            }
            catch (error) {
                console.error(error);
            }
            finally {
                setIsLoading(false);
            }
        }

        fetchMedia();
    }, [id]);

    async function handleAddClick() {
        try {
            if(detailedMediaInfo === null) return;

            const result = await myMediaApi.createMedia(detailedMediaInfo, "movie");
            const data = result.data;

            if(data.isSuccess) {
                toast.success("Media added");
            }

            navigate("..");
        }
        catch(e) {
            if (axios.isAxiosError<BackendResult<MediaItem>>(e)) {
                toast.error(e.response?.data?.message ?? "Request failed");
                console.error(e.response);
                return;
            }

            toast.error("Unexpected error");
            console.error(e);
        }
    }

    return (
        <div className={s.mediaDetailsContainer} onClick={handleClose}>
            <div className={s.mediaDetailsPanel} onClick={(e) => e.stopPropagation()}>
                <button onClick={handleClose} className={s.closeButton} title="Close">
                    <X size={20} />
                </button>

                {isLoading ? (
                    <>
                        <div className={`${s.skeleton} ${s.sHeader}`}></div>
                        <div className={`${s.skeleton} ${s.sTitle}`}></div>
                        <div className={`${s.skeleton} ${s.sText}`}></div>
                        <div className={`${s.skeleton} ${s.sText}`} style={{ width: '60%' }}></div>
                    </>
                ) : detailedMediaInfo ? (
                    <>
                        <div className={s.detailsHeader}>
                            {detailedMediaInfo.backdropPath && (
                                <img
                                    src={detailedMediaInfo.backdropPath}
                                    alt="Backdrop"
                                    className={s.detailsBackdrop}
                                />
                            )}
                        </div>

                        <div className={s.detailsContent}>
                            {detailedMediaInfo.posterPath && (
                                <img
                                    src={detailedMediaInfo.posterPath}
                                    className={s.posterThumb}
                                    alt="Poster"
                                />
                            )}

                            <h1 className={s.detailsTitle}>{detailedMediaInfo.title}</h1>

                            {detailedMediaInfo.tagline && (
                                <p className={s.tagline}>{detailedMediaInfo.tagline}</p>
                            )}

                            <div className={s.statsRow}>
                                <div className={s.statBadge}>
                                    <Calendar size={14} />
                                    {new Date(detailedMediaInfo.releaseDate).getFullYear()}
                                </div>
                                <div className={s.statBadge}>
                                    <Clock size={14} />
                                    {detailedMediaInfo.runtime} min
                                </div>
                                <div className={`${s.statBadge} ${s.rating}`}>
                                    <Star size={14} fill="#ffd700" color="#ffd700" />
                                    {detailedMediaInfo.voteAverage.toFixed(1)}
                                </div>
                                {detailedMediaInfo.isAdult &&
                                    <div className={s.statBadge} style={{ background: '#e74c3c' }}>18+</div>
                                }
                            </div>

                            <div className={s.section}>
                                <div className={s.sectionTitle}>Overview</div>
                                <p className={s.overviewText}>{detailedMediaInfo.overview}</p>
                            </div>

                            <div className={s.section}>
                                <div className={s.sectionTitle}>Genres</div>
                                <div className={s.genreList}>
                                    {detailedMediaInfo.genres.map(g => (
                                        <span key={g.id} className={s.genreTag}>
                                            {g.name}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <button className={s.addToListBtn} onClick={handleAddClick}>Add to my list</button>
                        </div>

                    </>
                ) : (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                        <h2>Media not found</h2>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MediaDetails;
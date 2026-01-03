import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { type MediaDetails, myMediaApi } from "../../api/myMediaApi.ts";
import type { AxiosError } from "axios";
import type { BackendResult } from "../../api/types.ts";
import { toast } from "react-toastify";
import { Clock, Star, ArrowLeft, BookOpen, Trash2 } from "lucide-react";
import s from "./MediaItemDetails.module.css";
import { PLACEHOLDER_IMG } from "../../consts.ts";
import { formatRuntime, getStatusColor, getYear } from "../../globalFunctions.ts";

interface Note {
    id: number;
    content: string;
    createdAt: string;
}

const MOCK_NOTES: Note[] = [
    { id: 1, content: "The plot twist at the end was insane! Definitely didn't see that coming.", createdAt: "2023-10-15" },
    { id: 2, content: "Cinematography is beautiful, but the pacing felt a bit slow in the second act.", createdAt: "2023-10-20" },
    { id: 3, content: "Must watch again to catch all the easter eggs.", createdAt: "2023-11-01" },
];

function MediaItemDetails() {
    const { id } = useParams<{ id: string }>();
    const [mediaDetails, setMediaDetails] = useState<MediaDetails | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const [notes, setNotes] = useState<Note[]>([]);

    useEffect(() => {
        async function handleFetch() {
            if (!id) return;

            try {
                setIsLoading(true);
                const result = await myMediaApi.getDetails(id);
                const data = result.data;

                if (data.isSuccess && data.data) {
                    setMediaDetails(data.data);
                    setNotes(MOCK_NOTES);
                }
            } catch (e) {
                const error = e as AxiosError<BackendResult<MediaDetails>>;
                toast.error(error.response?.data.message ?? "Request failed");
                navigate("/media/list");
            } finally {
                setIsLoading(false);
            }
        }

        handleFetch();
    }, [id, navigate]);

    if (isLoading || mediaDetails === null) {
        return <div className={s.loadingScreen}>Loading details...</div>;
    }

    const { mediaInfo } = mediaDetails;

    return (
        <div className={s.pageContainer}>
            {/* --- HERO SECTION --- */}
            <div className={s.heroWrapper}>
                {/* Background Image & Gradient */}
                <div
                    className={s.heroBackground}
                    style={{
                        backgroundImage: `url(${mediaInfo.backdropPath || mediaInfo.posterPath})`
                    }}
                />
                <div className={s.heroGradientOverlay} />

                {/* Content */}
                <div className={s.heroContentContainer}>
                    <button className={s.backButton} onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} /> Back
                    </button>

                    <div className={s.heroMainContent}>
                        {/* Poster */}
                        <div className={s.posterWrapper}>
                            <img
                                src={mediaInfo.posterPath || PLACEHOLDER_IMG}
                                alt={mediaInfo.title}
                                className={s.poster}
                            />
                        </div>

                        {/* Info */}
                        <div className={s.infoWrapper}>
                            <h1 className={s.title}>
                                {mediaInfo.title}
                                <span className={s.year}>({getYear(mediaInfo.releaseDate)})</span>
                            </h1>

                            {mediaInfo.tagline && <p className={s.tagline}>{mediaInfo.tagline}</p>}

                            <div className={s.metaRow}>
                                <span className={s.metaItem}>
                                    <Clock size={16} /> {formatRuntime(mediaInfo.runtime)}
                                </span>
                                <span className={s.metaItem}>
                                    <Star size={16} color="gold" /> {mediaInfo.voteAverage.toFixed(1)} TMDB
                                </span>
                                {mediaDetails.userRating && (
                                    <span className={s.userScore}>
                                        My Score: <b>{mediaDetails.userRating}/10</b>
                                    </span>
                                )}
                            </div>

                            <div className={s.genres}>
                                {mediaInfo.genres.map(g => (
                                    <span key={g.id} className={s.genreBadge}>{g.name}</span>
                                ))}
                            </div>

                            <div className={s.statusContainer}>
                                Status:
                                <span
                                    className={s.statusBadge}
                                    style={{ backgroundColor: getStatusColor(mediaDetails.status) }}
                                >
                                    {mediaDetails.status}
                                </span>
                            </div>

                            <div className={s.overview}>
                                <h3>Overview</h3>
                                <p>{mediaInfo.overview}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- NOTES SECTION --- */}
            <div className={s.notesSection}>
                <div className={s.notesHeader}>
                    <h2><BookOpen size={24} /> My Notes</h2>
                    <button className={s.addNoteBtn}>+ Add Note</button>
                </div>

                <div className={s.notesGrid}>
                    {notes.map(note => (
                        <div key={note.id} className={s.noteCard}>
                            <p className={s.noteContent}>{note.content}</p>
                            <div className={s.noteFooter}>
                                <span className={s.noteDate}>{note.createdAt}</span>
                                <button className={s.deleteNoteBtn}><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                    {notes.length === 0 && <p className={s.emptyNotes}>No notes yet. Start writing!</p>}
                </div>
            </div>
        </div>
    );
}

export default MediaItemDetails;
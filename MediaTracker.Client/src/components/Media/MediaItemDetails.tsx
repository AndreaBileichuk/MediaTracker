import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { type MediaDetails, myMediaApi } from "../../api/myMediaApi.ts";
import type { AxiosError } from "axios";
import type { BackendResult } from "../../api/types.ts";
import { toast } from "react-toastify";
import { Clock, Star, ArrowLeft, BookOpen, Trash2, XCircle } from "lucide-react";
import s from "./MediaItemDetails.module.css";
import { PLACEHOLDER_IMG } from "../../consts.ts";
import { formatRuntime, getStatusColor, getYear } from "../../globalFunctions.ts";
import StatusSelector from "./StatusSelector.tsx";
import type { MediaStatus } from "../../api/myMediaApi.ts";
import ConfirmationModal from "../common/ConfirmationModal/ConfirmationModal.tsx";

interface Note {
    id: number;
    content: string;
    createdAt: string;
}

const MOCK_NOTES: Note[] = [
    {
        id: 1,
        content: "The plot twist at the end was insane! Definitely didn't see that coming.",
        createdAt: "2023-10-15"
    },
    {
        id: 2,
        content: "Cinematography is beautiful, but the pacing felt a bit slow in the second act.",
        createdAt: "2023-10-20"
    },
    { id: 3, content: "Must watch again to catch all the easter eggs.", createdAt: "2023-11-01" },
];

function MediaItemDetails() {
    const { id } = useParams<{ id: string }>();
    const [mediaDetails, setMediaDetails] = useState<MediaDetails | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

    async function handleStatusChange(status: MediaStatus) {
        if (mediaDetails == null) return;

        try {
            const result = await myMediaApi.changeStatus(mediaDetails.id, status);
            const data = result.data;

            if (data.isSuccess) {
                setMediaDetails(prev =>
                    prev
                        ? {
                            ...prev,
                            status: status
                        }
                        : prev
                );

                toast.success(`Status was changed successfully`);
            }
        }
        catch (e) {
            const error = e as AxiosError<BackendResult<void>>;
            toast.error(error.response?.data.message);
            console.log(error);
        }
    }

    const handleRate = () => {
        toast.info("Rate clicked (Not implemented yet)");
    };

    const handleDrop = async () => {
        if (window.confirm(`Are you sure you want to drop "${mediaDetails?.mediaInfo.title}" from your list?`)) {
            if (mediaDetails === null) return;

            try {
                const result = await myMediaApi.dropMedia(mediaDetails?.id);
                const data = result.data;

                if (data.isSuccess) {
                    toast.success("Successfully dropped");
                    navigate("/media/list");
                }
            }
            catch (e) {
                const error = e as AxiosError<BackendResult<void>>;
                toast.error(error.response?.data.message ?? "Something went wrong");
            }
        }
    };

    async function handleDeleteForever() {
        if (!mediaDetails) return;

        try {
            const result = await myMediaApi.deleteMedia(mediaDetails.id);
            const data = result.data;

            if (data.isSuccess) {
                toast.success("The media was deleted successfully");
                setIsDeleteModalOpen(false);
                navigate("..");
            }

        }
        catch (e) {
            const error = e as AxiosError<BackendResult<void>>;
            toast.error(error.response?.data.message);
        }

    }

    if (isLoading || mediaDetails === null) {
        return <div className={s.loadingScreen}>Loading details...</div>;
    }

    const { mediaInfo } = mediaDetails;
    const isDropped = mediaDetails.status === "Dropped";

    return (
        <div className={s.pageContainer}>
            <div className={s.heroWrapper}>
                <div
                    className={s.heroBackground}
                    style={{
                        backgroundImage: `url(${mediaInfo.backdropPath || mediaInfo.posterPath})`
                    }}
                />
                <div className={s.heroGradientOverlay} />

                <div className={s.heroContentContainer}>
                    <button className={s.backButton} onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} /> Back
                    </button>

                    <div className={s.heroMainContent}>
                        <div className={s.posterWrapper}>
                            <img
                                src={mediaInfo.posterPath || PLACEHOLDER_IMG}
                                alt={mediaInfo.title}
                                className={s.poster}
                            />
                        </div>

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
                            </div>

                            <div className={s.actionsToolbar}>
                                <StatusSelector
                                    mediaDetails={mediaDetails}
                                    onStatusUpdate={handleStatusChange}
                                    getStatusColor={getStatusColor}
                                />

                                <button
                                    className={s.actionBtn}
                                    onClick={handleRate}
                                    title="Rate this title"
                                >
                                    <span className={s.actionLabel}>My Score</span>
                                    <span className={s.actionValue}>
                                        <Star
                                            size={14}
                                            className={mediaDetails.userRating ? s.filledStar : ''}
                                        />
                                        {mediaDetails.userRating ? `${mediaDetails.userRating}/10` : "Rate"}
                                    </span>
                                </button>

                                <button
                                    className={`${s.actionBtn} ${s.dropBtn} ${(isDropped || mediaDetails.status === 'Completed') ? s.btnDisable : ""}`}
                                    onClick={handleDrop}
                                    title="Remove from list"
                                    disabled={isDropped || (mediaDetails.status === 'Completed')}
                                >
                                    <XCircle size={18} />
                                    <span>Drop</span>
                                </button>

                                <button
                                    className={`${s.actionBtn} ${s.deleteBtn}`}
                                    onClick={() => setIsDeleteModalOpen(true)}
                                    title="Delete Permanently"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>

                            <div className={s.genres}>
                                {mediaInfo.genres.map(g => (
                                    <span key={g.id} className={s.genreBadge}>{g.name}</span>
                                ))}
                            </div>

                            <div className={s.overview}>
                                <h3>Overview</h3>
                                <p>{mediaInfo.overview}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteForever}
                title="Delete Permanently?"
                message="If you delete this, all your notes, rating, and history associated with this media will be permanently removed. You can add it again later, but your data will be gone."
                confirmLabel="Yes, Delete Forever"
            />
        </div>
    );
}

export default MediaItemDetails;
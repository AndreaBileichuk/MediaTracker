import React, { useEffect, useState } from "react";
import {type FilterType, myMediaApi, type MyMediaListApiResponse} from "../../api/myMediaApi.ts";
import Pagination from "../common/Pagination/Pagination.tsx";
import { useNavigate } from "react-router-dom";
import s from "./Media.module.css";
import {Loader2, PlusCircle, XCircle, PlayCircle, CheckCircle, Clock, Film} from "lucide-react";
import { PLACEHOLDER_IMG } from "../../consts.ts";
import { getStatusColor } from "../../globalFunctions.ts";

const EMPTY_STATES: Record<FilterType, {
    icon: React.ReactNode;
    title: string;
    description: string;
    showButton: boolean;
}> = {
    Active: {
        icon: <Film size={48} />,
        title: "Your list is empty",
        description: "Start tracking movies and TV shows you love.",
        showButton: true
    },
    InProcess: {
        icon: <PlayCircle size={48} />,
        title: "Nothing in progress",
        description: "You aren't currently watching anything. Time to start something new?",
        showButton: true
    },
    Planned: {
        icon: <Clock size={48} />,
        title: "Watchlist is empty",
        description: "You haven't added anything to your plan yet.",
        showButton: true
    },
    Completed: {
        icon: <CheckCircle size={48} />,
        title: "No completed titles",
        description: "You haven't finished any shows or movies yet. Keep watching!",
        showButton: false
    },
    Dropped: {
        icon: <XCircle size={48} />, // or emoji '🗑️'
        title: "No dropped items",
        description: "Great! You haven't dropped any shows yet.",
        showButton: false
    }
};

function MediaList() {
    const [myMedia, setMyMedia] = useState<MyMediaListApiResponse | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeFilter, setActiveFilter] = useState<FilterType>('Active');
    const navigate = useNavigate();

    const currentEmptyState = EMPTY_STATES[activeFilter];

    useEffect(() => {
        async function handleFetch() {
            try {
                const result = await myMediaApi.getMedia(currentPage, activeFilter);
                const data = result.data;
                if (data.isSuccess && data.data) {
                    setMyMedia(data.data);
                }
            } catch (e) {
                console.log(e);
            }
        }

        handleFetch();
    }, [currentPage, activeFilter]);

    const handleFilterChange = (newFilter: FilterType) => {
        if (newFilter === activeFilter) return;
        setActiveFilter(newFilter);
        setCurrentPage(1);
    };

    function handleMediaClick(id: number) {
        navigate(`${id}`);
    }

    if (myMedia == null) {
        return <div className={s.loadingContainer}><Loader2 className={s.spinner} size={40} /></div>;
    }

    return (
        <div className={s.container}>
            <header className={s.header}>
                <div>
                    <h1>My Collection</h1>
                    <span className={s.countBadge}>{myMedia.totalCount || 0} items</span>
                </div>
                <MediaListButton text="Explore More" />
            </header>

            <div className={s.filterBar}>
                <button
                    className={`${s.filterBtn} ${activeFilter === 'Active' ? s.activeFilter : ''}`}
                    onClick={() => handleFilterChange('Active')}
                >
                    All Active
                </button>

                <div className={s.divider} />

                <button
                    className={`${s.filterBtn} ${activeFilter === 'Planned' ? s.activeFilter : ''}`}
                    onClick={() => handleFilterChange('Planned')}
                    title="Planned"
                >
                    <Clock size={16} /> <span className={s.btnLabel}>Planned</span>
                </button>

                <button
                    className={`${s.filterBtn} ${activeFilter === 'InProcess' ? s.activeFilter : ''}`}
                    onClick={() => handleFilterChange('InProcess')}
                    title="In process"
                >
                    <PlayCircle size={16} /> <span className={s.btnLabel}>In process</span>
                </button>

                <button
                    className={`${s.filterBtn} ${activeFilter === 'Completed' ? s.activeFilter : ''}`}
                    onClick={() => handleFilterChange('Completed')}
                    title="Completed"
                >
                    <CheckCircle size={16} /> <span className={s.btnLabel}>Completed</span>
                </button>

                <div className={s.divider} />

                <button
                    className={`${s.filterBtn} ${s.droppedBtn} ${activeFilter === 'Dropped' ? s.activeFilter : ''}`}
                    onClick={() => handleFilterChange('Dropped')}
                >
                    <XCircle size={16} /> Dropped
                </button>
            </div>

            {myMedia.results && myMedia.results.length === 0 ? (
                <div className={s.emptyState}>
                    <div className={s.emptyIcon} style={{ color: '#666' }}>
                        {currentEmptyState.icon}
                    </div>

                    <h2>{currentEmptyState.title}</h2>

                    <p>{currentEmptyState.description}</p>

                    {currentEmptyState.showButton && (
                        <MediaListButton text="Explore Media" />
                    )}
                </div>
            ) : (
                <div className={s.grid}>
                    {myMedia.results?.map(m => (
                        <div key={m.id} className={s.card} onClick={() => handleMediaClick(m.id)}>
                            <div className={s.posterWrapper}>
                                <img
                                    src={m.posterPath || PLACEHOLDER_IMG}
                                    alt={m.title}
                                    className={s.poster}
                                    loading="lazy"
                                />
                                <div className={s.typeBadge}>{m.type}</div>
                            </div>

                            <div className={s.content}>
                                <h3 className={s.title} title={m.title}>{m.title}</h3>
                                <div className={s.meta}>
                                    <span className={`${s.statusBadge}`}
                                          style={{ backgroundColor: getStatusColor(m.status) }}>
                                        {m.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {myMedia.results && myMedia.results.length > 0 && (
                <Pagination
                    totalPages={myMedia.totalPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            )}
        </div>
    );
}

function MediaListButton({ text }: { text: string }) {
    const navigate = useNavigate();

    return <button className={s.ctaButton} onClick={() => navigate("/media/search")}>
        <PlusCircle size={20} />
        {text}
    </button>
}

export default MediaList;
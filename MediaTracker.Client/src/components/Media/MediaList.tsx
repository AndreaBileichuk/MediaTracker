import {useEffect, useState} from "react";
import {myMediaApi, type MyMediaListApiResponse} from "../../api/myMediaApi.ts";
import Pagination from "../common/Pagination/Pagination.tsx";
import {useNavigate} from "react-router-dom";
import s from "./Media.module.css";
import { Loader2, PlusCircle } from "lucide-react";
import {PLACEHOLDER_IMG} from "../../consts.ts";
import {getStatusColor} from "../../globalFunctions.ts";

function MediaList() {
    const [myMedia, setMyMedia] = useState<MyMediaListApiResponse | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        async function handleFetch() {
            try {
                const result = await myMediaApi.getMedia(currentPage);
                const data = result.data;

                if(data.isSuccess && data.data) {
                    setMyMedia(data.data);
                }
            }
            catch(e) {
                console.log(e);
            }
        }

        handleFetch();
    }, [currentPage])

    function handleMediaClick(id: number) {
        navigate(`${id}`);
    }

    if(myMedia == null || myMedia.results == null) {
        return <div className={s.loadingContainer}><Loader2 className={s.spinner} size={40}/></div>
    }

    return (
        <div className={s.container}>
            <header className={s.header}>
                <div>
                    <h1>My Collection</h1>
                    <span className={s.countBadge}>{myMedia.totalCount || 0} items</span>
                </div>

                <MediaListButton text="Explore More"/>
            </header>

            {myMedia.results.length === 0 ? (
                <div className={s.emptyState}>
                    <div className={s.emptyIcon}>🎬</div>
                    <h2>Your list is empty</h2>
                    <p>Start tracking movies and TV shows you love.</p>
                    <MediaListButton text="Explore Media"/>
                </div>
            ) : (
                <div className={s.grid}>
                    {myMedia.results.map(m => (
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
                                          style={{ backgroundColor: getStatusColor(m.status)}}>
                                        {m.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {myMedia.results.length > 0 && (
                    <Pagination
                        totalPages={myMedia.totalPages}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
            )}
        </div>
    );
}

function MediaListButton({text}: {text: string}) {
    const navigate = useNavigate();

    return <button className={s.ctaButton} onClick={() => navigate("/media/search")}>
        <PlusCircle size={20}/>
        {text}
    </button>
}

export default MediaList;
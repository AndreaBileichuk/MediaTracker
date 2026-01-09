import styles from "../MediaProvider.module.css";
import { Link } from "react-router-dom";
import type {MediaType, ProvidedMedia} from "../../../api/mediaProviderApi.ts";
import React from "react";
import {PLACEHOLDER_IMG} from "../../../utils/consts.ts";

interface MediaCardProps {
    type: MediaType,
    media: ProvidedMedia
}

function MediaCard({ media, type}: MediaCardProps) {
    function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
        const img = e.currentTarget;
        img.onerror = null;
        img.src = PLACEHOLDER_IMG;
    }

    return (
        <li className={styles.card}>
            <Link to={`${type}/${media.id}`}
                  style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
                <div className={styles.posterWrapper}>
                    <img
                        src={media.posterPath ?? PLACEHOLDER_IMG}
                        alt={media.title}
                        className={styles.poster}
                        onError={handleImageError}
                        loading="lazy"
                    />
                </div>

                <div className={styles.content}>
                    <h3 className={styles.title} title={media.title}>{media.title}</h3>

                    <div className={styles.meta}>
                        <span>
                            {media.releaseDate
                                ? new Date(media.releaseDate).getFullYear()
                                : "Unknown"}
                        </span>

                        {media.isAdult && (
                            <span className={styles.badge} style={{ borderColor: '#ff4444', color: '#ff4444' }}>
                                18+
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </li>
    )
}

export default MediaCard;
import s from "./SeasonList.module.css";
import type { Season } from "../../../api/mediaProviderApi.ts";

interface Props {
    seasons: Season[];
}

export default function SeasonsList({ seasons }: Props) {
    if (!seasons || seasons.length === 0) return null;

    return (
        <div className={s.section}>
            <div className={s.sectionTitle}>Seasons ({seasons.length})</div>
            <div className={s.seasonsGrid}>
                {seasons.map(season => (
                    <div key={season.id} className={s.seasonCard}>
                        <div className={s.seasonPosterWrapper}>
                            <img
                                src={season.posterPath ? `https://image.tmdb.org/t/p/w500${season.posterPath}` : "/placeholder.png"}
                                alt={season.name}
                                className={s.seasonPoster}
                                loading="lazy"
                            />
                        </div>
                        <div className={s.seasonInfo}>
                            <h4>{season.name}</h4>
                            <span>{season.episodeCount} Episodes</span>
                            {season.airDate && (
                                <span className={s.year}>{season.airDate.split('-')[0]}</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
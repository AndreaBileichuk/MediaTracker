import type {ProvidedMedia} from "../../../api/mediaApi.ts";
import styles from "../MediaProvider.module.css";
import MediaCard from "./MediaCard.tsx";

interface MediaListProps {
    mediaList: ProvidedMedia[] | null
}

function MediaList({mediaList} : MediaListProps) {
    return (
        <ul className={styles.grid}>
            {mediaList?.map(m => (
                <MediaCard media={m} key={m.id}/>
            ))}
        </ul>
    );
}

export default MediaList;
import type {MediaType, ProvidedMedia} from "../../../api/mediaProviderApi.ts";
import styles from "../MediaProvider.module.css";
import MediaCard from "./MediaCard.tsx";

interface MediaListProps {
    mediaList: ProvidedMedia[] | null,
    type: MediaType
}

function MediaList({mediaList, type} : MediaListProps) {
    return (
        <ul className={styles.grid}>
            {mediaList?.map(m => (
                <MediaCard media={m} key={m.id} type={type}/>
            ))}
        </ul>
    );
}

export default MediaList;
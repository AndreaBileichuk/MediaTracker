import styles from "../MediaProvider.module.css";
import type {MediaType} from "../../../api/mediaProviderApi.ts";

interface TypeSelectorProps {
    handleTypeChange: (type: MediaType) => void,
    type: MediaType
}

function TypeSelector({handleTypeChange, type} : TypeSelectorProps) {
    return (
        <div className={styles.typeSelector} style={{marginBottom: '1rem', display: 'flex', gap: '10px'}}>
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
    )
}

export default TypeSelector;
import {useMemo} from 'react';
import styles from './Pagination.module.css';

interface PaginationProps {
    totalPages: number,
    currentPage: number,
    setCurrentPage: (page: number) => void,
}

function Pagination({totalPages, currentPage, setCurrentPage}: PaginationProps) {

    const paginationRange = useMemo(() => {
        const delta = 1;
        const range = [];
        const rangeWithDots = [];
        let l;

        range.push(1);

        for (let i = currentPage - delta; i <= currentPage + delta; i++) {
            if (i < totalPages && i > 1) {
                range.push(i);
            }
        }

        if (totalPages > 1) {
            range.push(totalPages);
        }

        for (const i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        }

        return rangeWithDots;
    }, [currentPage, totalPages]);

    if (totalPages <= 1) return null;

    return (
        <div className={styles.paginationContainer}>
            {paginationRange.map((p, index) => {
                if (p === '...') {
                    return (
                        <span key={`dots-${index}`} className={styles.dots}>
                            ...
                        </span>
                    );
                }

                return (
                    <button
                        key={p}
                        className={`${styles.pageItem} ${p === currentPage ? styles.active : ""}`}
                        onClick={() => typeof p === 'number' && setCurrentPage(p)}
                    >
                        {p}
                    </button>
                );
            })}
        </div>
    );
}

export default Pagination;
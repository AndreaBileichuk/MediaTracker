import s from "../MediaItemDetails.module.css";
import { ChevronDown } from "lucide-react";
import { MEDIA_STATUSES, type MediaDetails } from "../../../api/myMediaApi.ts";
import { useEffect, useRef, useState } from "react";
import type { MediaStatus } from "../../../api/myMediaApi.ts";

interface StatusSelectorProps {
    mediaDetails: MediaDetails;
    onStatusUpdate: (status: MediaStatus) => void,
    getStatusColor: (status: string) => string
}

function StatusSelector({ mediaDetails, onStatusUpdate, getStatusColor }: StatusSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    function handleToggle() {
        setIsOpen(!isOpen);
    }

    function handleSelect(newStatus: MediaStatus) {
        onStatusUpdate(newStatus);
        setIsOpen(false);
    }

    function formatStatus(status: MediaStatus) {
        if (status === 'InProcess')
            return 'In process';

        return status;
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div style={{ position: 'relative', display: 'inline-block' }} ref={dropdownRef}>
            <button
                className={s.actionBtn}
                onClick={handleToggle}
                style={{ borderLeft: `4px solid ${getStatusColor(mediaDetails.status)}` }}
                title="Change Status"
            >
                <span className={s.actionLabel}>Status</span>
                <span className={s.actionValue}>
                    {formatStatus(mediaDetails.status)}
                    <ChevronDown
                        size={14}
                        style={{
                            opacity: 0.7,
                            marginLeft: '8px',
                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s'
                        }}
                    />
                </span>
            </button>

            {isOpen && (
                <div className={s.dropdownMenu}>
                    {MEDIA_STATUSES.map((status) => {
                        if (status == mediaDetails.status) return;
                        if (status == 'Dropped') return;

                        return (
                            <div
                                className={s.dropdownStatusItem}
                                key={status}
                                onClick={() => handleSelect(status)}
                                style={{
                                    borderLeft: `3px solid ${getStatusColor(status)}`
                                }}
                            >
                                {formatStatus(status)}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
}

export default StatusSelector;
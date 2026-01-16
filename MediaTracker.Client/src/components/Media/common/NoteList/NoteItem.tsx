import { Trash2, Clock, Tag } from "lucide-react";
import s from "./NoteList.module.css";
import { type Note } from "../../../../api/noteApi.ts";
import { formatDate } from "../../../../utils/globalFunctions.ts";

interface NoteItemProps {
    note: Note;
    handleNoteDelete: (id: number) => void;
    isDeleting: boolean
}

const NoteItem = ({ note, handleNoteDelete, isDeleting }: NoteItemProps) => {
    const formattedDate = formatDate(note.createdAt);

    return (
        <div className={s.noteCard}>
            <div className={s.noteHeader}>
                <h4 className={s.noteTitle}>
                    {note.title}
                </h4>

                <div className={s.noteMeta}>
                    {note.timestamp && (
                        <span className={s.noteBadge}>
                            <Clock size={12} /> {note.timestamp}
                        </span>
                    )}

                    {/* Display Note Type */}
                    <span className={s.noteBadge}>
                        <Tag size={12} /> {note.type}
                    </span>
                </div>
            </div>

            <div className={s.noteContent}>
                {note.text}
            </div>

            <div className={s.noteFooter}>
                <span className={s.noteDate}>{formattedDate}</span>
                <button
                    className={s.deleteNoteBtn}
                    onClick={() => handleNoteDelete(note.id)}
                    title="Delete Note"
                    disabled={isDeleting}
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};

export default NoteItem;
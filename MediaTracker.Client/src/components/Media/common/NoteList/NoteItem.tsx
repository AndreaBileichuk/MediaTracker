import { Trash2, Clock, Tag, Edit2 } from "lucide-react";
import s from "./NoteList.module.css";
import { type Note } from "../../../../api/noteApi.ts";
import { formatDate } from "../../../../utils/globalFunctions.ts";

interface NoteItemProps {
    note: Note;
    handleNoteDelete: (id: number) => void;
    handeNoteUpdateInitiate: (note: Note) => void;
    isDeleting: boolean
}

const NoteItem = ({ note, handleNoteDelete, isDeleting, handeNoteUpdateInitiate }: NoteItemProps) => {
    const formattedDate = formatDate(note.createdAt);

    return (
        <div className={s.noteCard}>
            <div className={s.noteHeaderRow}>
                <div className={s.noteHeaderLeft}>
                    <h4 className={s.noteTitle}>{note.title}</h4>
                    <div className={s.noteMeta}>
                        {note.timestamp && (
                            <span className={s.noteBadge}>
                                <Clock size={12} /> {note.timestamp}
                            </span>
                        )}
                        <span className={s.noteBadge}>
                            <Tag size={12} /> {note.type}
                        </span>
                    </div>
                </div>

                <div className={s.noteHeaderRight}>
                    <span className={s.noteDate}>{formattedDate}</span>
                    <div className={s.noteActions}>
                        <button
                            className={s.actionBtnIcon}
                            onClick={() => handeNoteUpdateInitiate(note)}
                            title="Update Note"
                        >
                            <Edit2 size={20} />
                        </button>
                        <button
                            className={s.actionBtnIcon}
                            onClick={() => handleNoteDelete(note.id)}
                            title="Delete Note"
                            disabled={isDeleting}
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <div className={s.noteContent}>
                {note.text}
            </div>
        </div>
    );
};

export default NoteItem;
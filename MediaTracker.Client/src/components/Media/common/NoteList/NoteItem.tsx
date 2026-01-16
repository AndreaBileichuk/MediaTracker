import { Trash2, Clock, Tag } from "lucide-react";
import s from "./NoteList.module.css";
import { type Note } from "../../../../api/noteApi.ts";
import {formatDate} from "../../../../utils/globalFunctions.ts";

interface NoteItemProps {
    note: Note;
    handleNoteDelete: (id: number) => void;
}

const NoteItem = ({ note, handleNoteDelete }: NoteItemProps) => {
    const formattedDate = formatDate(note.createdAt);

    return (
        <div className={s.noteCard}>
            <div style={{ marginBottom: "10px" }}>
                <h4 style={{ color: "#fff", margin: "0 0 5px 0", fontSize: "1.1rem" }}>
                    {note.title}
                </h4>

                <div style={{ display: "flex", gap: "10px", fontSize: "0.8rem", color: "#888" }}>
                    {/* Display Timestamp if it exists (e.g. video time) */}
                    {note.timestamp && (
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <Clock size={12} /> {note.timestamp}
                        </span>
                    )}

                    {/* Display Note Type */}
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
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
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};

export default NoteItem;
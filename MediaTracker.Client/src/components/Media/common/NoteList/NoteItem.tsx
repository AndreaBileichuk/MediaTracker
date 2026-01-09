import s from "./NoteList.module.css";
import {Trash2} from "lucide-react";
import type {Note} from "../../../../api/noteApi.ts";
import {formatDate} from "../../../../utils/globalFunctions.ts";

interface NoteProps {
    note: Note
}

function NoteItem({note} : NoteProps) {
    return (
        <div className={s.noteCard}>
            <p className={s.noteContent}>{note.text}</p>
            <div className={s.noteFooter}>
                <span className={s.noteDate}>{formatDate(note.createdAt)}</span>
                <button className={s.deleteNoteBtn}><Trash2 size={16}/></button>
            </div>
        </div>
    );
}

export default NoteItem;
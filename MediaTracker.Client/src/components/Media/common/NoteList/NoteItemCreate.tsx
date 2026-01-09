import { useState, type KeyboardEvent } from "react";
import s from "./NoteList.module.css";

interface NoteItemCreateProps {
    handleNoteCreate: (text: string) => void,
    handleNoteCreateCancel: () => void
}

export function NoteItemCreate({ handleNoteCreate, handleNoteCreateCancel }: NoteItemCreateProps) {
    const [text, setText] = useState("");

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleNoteCreate(text);
        }
    }

    return (
        <div className={s.noteCard}>
            <input
                className={s.createInput}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter note..."
                autoFocus
                value={text}
            />
            <div className={s.createActions}>
                <button className={`${s.actionBtn} ${s.cancelBtn}`} onClick={handleNoteCreateCancel}>Cancel</button>
                <button className={`${s.actionBtn} ${s.saveBtn}`} onClick={() => handleNoteCreate(text)}>Save</button>
            </div>
        </div>
    )
}
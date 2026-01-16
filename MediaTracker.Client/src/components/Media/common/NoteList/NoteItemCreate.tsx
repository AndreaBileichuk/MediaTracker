import { useState } from "react";
import s from "./NoteList.module.css";
import {type CreateNote, NOTE_TYPES, type NoteType} from "../../../../api/noteApi.ts";

interface NoteItemCreateProps {
    handleNoteCreate: (newNote: CreateNote) => void;
    handleNoteCreateCancel: () => void;
}

export function NoteItemCreate({ handleNoteCreate, handleNoteCreateCancel }: NoteItemCreateProps) {
    const [createNote, setCreateNote] = useState<CreateNote>({
        text: "",
        title: "",
        timestamp: "",
        type: "General"
    });

    function handleSave() {
        if (!createNote.title.trim() || !createNote.text.trim()) return;

        handleNoteCreate({
            ...createNote,
            timestamp: createNote.timestamp === "" ? null : createNote.timestamp
        });
    }

    return (
        <div className={s.noteCard} style={{ border: "1px solid #555" }}>
            <input
                className={s.createInput}
                onChange={(e) => setCreateNote(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Note Title..."
                autoFocus
                value={createNote.title}
                style={{ fontSize: "1.1rem", fontWeight: "bold" }}
            />

            <div style={{ display: "flex", gap: "10px", marginBottom: "1rem" }}>
                <select
                    className={s.createInput}
                    value={createNote.type}
                    onChange={(e) => setCreateNote(prev => ({ ...prev, type: e.target.value as NoteType }))}
                    style={{ width: "50%", marginBottom: 0, cursor: "pointer", color: "#aaa" }}
                >
                    {NOTE_TYPES.map(type => (
                        <option key={type} value={type} style={{ color: "black" }}>
                            {type}
                        </option>
                    ))}
                </select>

                <input
                    className={s.createInput}
                    onChange={(e) => setCreateNote(prev => ({ ...prev, timestamp: e.target.value }))}
                    placeholder="Time (e.g. 01:30)"
                    value={createNote.timestamp || ""}
                    style={{ width: "50%", marginBottom: 0 }}
                />
            </div>

            <textarea
                className={s.createInput}
                onChange={(e) => setCreateNote(prev => ({ ...prev, text: e.target.value }))}
                placeholder="Write your note here..."
                value={createNote.text}
                rows={3}
                style={{ resize: "none" }}
            />

            <div className={s.createActions}>
                <button
                    className={`${s.actionBtn} ${s.cancelBtn}`}
                    onClick={handleNoteCreateCancel}
                >
                    Cancel
                </button>
                <button
                    className={`${s.actionBtn} ${s.saveBtn}`}
                    onClick={handleSave}
                    disabled={!createNote.title || !createNote.text}
                >
                    Save
                </button>
            </div>
        </div>
    );
}
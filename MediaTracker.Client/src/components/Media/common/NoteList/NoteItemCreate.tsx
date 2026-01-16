import {useState} from "react";
import s from "./NoteList.module.css";
import {type CreateNote, NOTE_TYPES, type NoteType, type UpdateNote} from "../../../../api/noteApi.ts";

interface NoteItemCreateProps {
    handleCommands: (newNote: CreateNote | UpdateNote) => void;
    handleNoteCreateCancel: () => void;
    isLoading: boolean,
    updateNote?: CreateNote | null
}

export function NoteItemCreate({ handleCommands, handleNoteCreateCancel, isLoading, updateNote }: NoteItemCreateProps) {
    const [createNote, setCreateNote] = useState<CreateNote>(updateNote || {
        text: "",
        title: "",
        timestamp: "",
        type: "General"
    });

    const [time, setTime] = useState(() => {
        const obj = createNote.timestamp?.split(":") ?? [];
        return {
            h: obj[0] ?? "",
            m: obj[1] ?? "",
            s: obj[2] ?? ""
        };
    });

    const timestamp =
        time.h === "" && time.m === "" && time.s === ""
            ? ""
            : `${time.h.padStart(2, "0")}:${time.m.padStart(2, "0")}:${time.s.padStart(2, "0")}`;

    function handleTimeChange(field: "h" | "m" | "s", value: string) {
        if (!/^\d*$/.test(value)) return;
        if (value.length > 2) return;

        setTime(prev => ({ ...prev, [field]: value }));
    }

    function handleTimeBlur(field: "h" | "m" | "s") {
        setTime(prev => {
            const val = prev[field];
            if (val === "") return prev;
            return { ...prev, [field]: val.padStart(2, "0") };
        });
    }

    function handleSave() {
        if (!createNote.title.trim() || !createNote.text.trim()) return;

        handleCommands({
            ...createNote,
            timestamp: timestamp || null
        });
    }

    return (
        <div className={`${s.noteCard} ${s.creationCard}`}>
            <input
                className={s.createTitleInput}
                onChange={(e) => setCreateNote(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Note Title..."
                autoFocus
                value={createNote.title}
            />

            <div className={s.createMetaRow}>
                <select
                    className={s.createSelect}
                    value={createNote.type}
                    onChange={(e) => setCreateNote(prev => ({ ...prev, type: e.target.value as NoteType }))}
                >
                    {NOTE_TYPES.map(type => (
                        <option key={type} value={type} style={{ color: "black" }}>
                            {type}
                        </option>
                    ))}
                </select>

                <div className={s.timeInputContainer} title="Timestamp (HH:MM:SS)">
                    <input
                        className={s.timeInput}
                        placeholder="00"
                        value={time.h}
                        onChange={(e) => handleTimeChange("h", e.target.value)}
                        onBlur={() => handleTimeBlur("h")}
                        maxLength={2}
                    />
                    <span className={s.timeSeparator}>:</span>
                    <input
                        className={s.timeInput}
                        placeholder="00"
                        value={time.m}
                        onChange={(e) => handleTimeChange("m", e.target.value)}
                        onBlur={() => handleTimeBlur("m")}
                        maxLength={2}
                    />
                    <span className={s.timeSeparator}>:</span>
                    <input
                        className={s.timeInput}
                        placeholder="00"
                        value={time.s}
                        onChange={(e) => handleTimeChange("s", e.target.value)}
                        onBlur={() => handleTimeBlur("s")}
                        maxLength={2}
                    />
                </div>
            </div>

            <textarea
                className={s.createTextArea}
                onChange={(e) => setCreateNote(prev => ({ ...prev, text: e.target.value }))}
                placeholder="Write your note here..."
                value={createNote.text}
                rows={3}
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
                    disabled={!createNote.title || !createNote.text || isLoading}
                >
                    Save
                </button>
            </div>
        </div>
    );
}
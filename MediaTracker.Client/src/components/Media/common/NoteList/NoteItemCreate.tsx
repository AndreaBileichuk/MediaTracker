import { useState } from "react";
import s from "./NoteList.module.css";
import { type CreateNote, NOTE_TYPES, type NoteType, type UpdateNote } from "../../../../api/noteApi.ts";
import { Clock, Check, X, Tag } from "lucide-react";

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
            <div className={s.creationHeaderRow}>
                <div className={s.createHeaderLeft}>
                    <input
                        className={s.createTitleInput}
                        onChange={(e) => setCreateNote(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Note Title..."
                        autoFocus
                        value={createNote.title}
                    />

                    <div className={s.createMetaRow}>
                        <div className={s.timeInputContainer} title="Timestamp (HH:MM:SS)">
                            <Clock size={11} />
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

                        <div className={s.createSelect}>
                            <Tag size={11} style={{ marginRight: 4 }} />
                            <select
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    color: "inherit",
                                    fontSize: "inherit",
                                    fontWeight: "inherit",
                                    outline: "none",
                                    cursor: "pointer"
                                }}
                                value={createNote.type}
                                onChange={(e) => setCreateNote(prev => ({ ...prev, type: e.target.value as NoteType }))}
                            >
                                {NOTE_TYPES.map(type => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className={s.createHeaderRight}>
                    <button
                        className={`${s.actionBtnIcon} ${s.saveBtnIcon}`}
                        onClick={handleSave}
                        disabled={!createNote.title || !createNote.text || isLoading}
                        title="Save Note"
                    >
                        <Check size={20} />
                    </button>
                    <button
                        className={`${s.actionBtnIcon} ${s.cancelBtnIcon}`}
                        onClick={handleNoteCreateCancel}
                        title="Cancel"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            <textarea
                className={s.createTextArea}
                onChange={(e) => setCreateNote(prev => ({ ...prev, text: e.target.value }))}
                placeholder="Write your note here..."
                value={createNote.text}
                rows={4}
            />
        </div>
    );
}
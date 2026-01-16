import s from "./NoteList.module.css"
import { BookOpen } from "lucide-react";
import NoteItem from "./NoteItem.tsx";
import { Fragment, useEffect, useState } from "react";
import {
    type CreateNote,
    type Note,
    noteApi,
    type NoteListApiResponse,
    type UpdateNote
} from "../../../../api/noteApi.ts";
import { type AxiosError } from "axios";
import type { BackendResult } from "../../../../api/types.ts";
import { showError, showSuccess } from "../../../../utils/toast.ts";
import { NoteItemCreate } from "./NoteItemCreate.tsx";

interface NoteList {
    mediaItemId: number
}

function NoteList({ mediaItemId }: NoteList) {
    const [state, setState] = useState<NoteListApiResponse | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const [createActive, setCreateActive] = useState(false);
    const [noteForUpdate, setNoteForUpdate] = useState<UpdateNote | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [deleting, setDeleting] = useState<number[]>([]);

    useEffect(() => {
        async function loadNotes() {
            try {
                const response = await noteApi.getNotes(mediaItemId, currentPage);
                const data = response.data;

                if (data.isSuccess && data.data) {
                    const value = data.data;
                    setState(prev => {
                        if (!prev) return { ...value };

                        const newResults = value.results;
                        const currentResults = prev.results;

                        const uniqueNewResults = newResults.filter(
                            newItem => !currentResults.some(existingItem => existingItem.id === newItem.id)
                        );

                        return {
                            ...prev,
                            totalPages: value.totalPages,
                            results: [...currentResults, ...uniqueNewResults]
                        };
                    });
                }
            }
            catch (e) {
                const err = e as AxiosError<BackendResult<NoteListApiResponse>>;
                showError(err.response?.data.message ?? "Something went wrong");
            }
        }

        loadNotes()
    }, [mediaItemId, currentPage]);

    function handleCommands(note: CreateNote | UpdateNote) {
        if ("id" in note) {
            handleNoteUpdate(note); // UpdateNote
        } else {
            handleNoteCreate(note); // CreateNote
        }
    }

    async function handleNoteCreate(newNote: CreateNote) {
        try {
            setIsCreating(true);
            const response = await noteApi.createNote(mediaItemId, newNote);
            const data = response.data;

            if (data.isSuccess && data.data) {
                const newNote = data.data;

                setCreateActive(false);
                setState((prev) => {
                    if (!prev) {
                        return {
                            results: [newNote],
                            totalPages: 1
                        };
                    }

                    return {
                        ...prev,
                        results: [newNote, ...prev.results],
                    };
                });

                showSuccess("Successfully created the note.")
            }
        }
        catch (e) {
            handleError(e);
            console.log(e);
        }
        finally {
            setIsCreating(false);
        }
    }

    async function handleNoteUpdate(note: UpdateNote) {
        try {
            setIsCreating(true);
            const response = await noteApi.updateNote(mediaItemId, note);
            const data = response.data;

            if (data.isSuccess && data.data) {
                const updatedNoteFromServer = data.data;

                setCreateActive(false);
                setState((prev) => {
                    if (!prev) return prev;

                    return {
                        ...prev,
                        results: prev.results.map(n =>
                            n.id === noteForUpdate?.id ? updatedNoteFromServer : n
                        )
                    };
                });
                setNoteForUpdate(null);
                showSuccess("Successfully created the note.")
            }
        }
        catch (e) {
            handleError(e);
            console.log(e);
        }
        finally {
            setIsCreating(false);
        }
    }

    function handleError(e: unknown) {
        const err = e as AxiosError<BackendResult<Note>>;

        if (err.response && err.response.data.errors.length > 0) {
            showError(err.response.data.errors[0].message ?? "Something went wrong");
        }
        else {
            showError(err.response?.data.message ?? "Something went wrong");
        }
    }

    function handleNoteCreateCancel() {
        setCreateActive(false);
        setNoteForUpdate(null);
    }

    async function handleNoteDelete(noteId: number) {
        try {
            setDeleting(prev => ([...prev, noteId]));
            const response = await noteApi.deleteNote(mediaItemId, noteId);
            const data = response.data;

            if (data.isSuccess) {
                setState(prev => {
                    if (!prev) return prev;

                    return {
                        ...prev,
                        results: prev.results.filter(n => n.id !== noteId)
                    }
                })
                showSuccess("Successfully deleted!")
            }
        }
        catch (e) {
            const err = e as AxiosError<BackendResult<void>>;
            showError(err.response?.data.message ?? "Something went wrong");
        }
        finally {
            setDeleting(prev => {
                return prev.filter(n => n !== noteId);
            });
        }
    }

    async function handleLoadMore() {
        if (state?.totalPages && currentPage >= state.totalPages) {
            return;
        }

        setCurrentPage(prev => prev + 1);
    }

    async function handeNoteUpdateInitiate(note: Note) {
        setNoteForUpdate({
            id: note.id,
            title: note.title,
            text: note.text,
            type: note.type,
            timestamp: note.timestamp
        });
    }

    if (state == null) {
        return <div>Loading notes...</div>
    }

    return (
        <div className={s.notesSection}>
            <div className={s.notesHeader}>
                <h2><BookOpen size={24} /> My Notes</h2>
                <button className={s.addNoteBtn} onClick={() => setCreateActive(true)}>+ Add Note</button>
            </div>

            <div className={s.notesGrid}>
                {createActive && <NoteItemCreate
                    handleCommands={handleCommands}
                    handleNoteCreateCancel={handleNoteCreateCancel}
                    isLoading={isCreating}
                />}
                {state.results.map(note => (
                    <Fragment key={note.id}>
                        {(noteForUpdate && noteForUpdate.id === note.id)
                            ? <NoteItemCreate
                                handleCommands={handleCommands}
                                handleNoteCreateCancel={handleNoteCreateCancel}
                                isLoading={isCreating}
                                updateNote={noteForUpdate}
                            />
                            : <NoteItem
                                isDeleting={deleting.includes(note.id)}
                                key={note.id}
                                note={note}
                                handleNoteDelete={handleNoteDelete}
                                handeNoteUpdateInitiate={handeNoteUpdateInitiate}
                            />
                        }
                    </Fragment>
                ))}
                {state.results.length === 0 && <p className={s.emptyNotes}>No notes yet. Start writing!</p>}

            </div>
            {(state?.totalPages && currentPage < state.totalPages) ? <button className={s.loadMoreBtn} onClick={handleLoadMore}>Load more</button> : <span></span>}
        </div>
    );
}

export default NoteList;
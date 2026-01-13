import s from "./NoteList.module.css"
import {BookOpen} from "lucide-react";
import NoteItem from "./NoteItem.tsx";
import {useEffect, useState} from "react";
import {type Note, noteApi, type NoteListApiResponse} from "../../../../api/noteApi.ts";
import {type AxiosError} from "axios";
import type {BackendResult} from "../../../../api/types.ts";
import {showError, showSuccess} from "../../../../utils/toast.ts";
import {NoteItemCreate} from "./NoteItemCreate.tsx";

interface NoteList {
    mediaItemId: number
}

function NoteList({mediaItemId}: NoteList) {
    const [state, setState] = useState<NoteListApiResponse | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const [createActive, setCreateActive] = useState(false);

    useEffect(() => {
        async function loadNotes() {
            try {
                const response = await noteApi.getNotes(mediaItemId, currentPage);
                const data = response.data;

                if(data.isSuccess && data.data) {
                    const value = data.data;
                    setState(prev => {
                        const array = prev?.results ? [...prev.results] : [];
                        return {
                            ...prev,
                            totalPages: value.totalPages,
                            results: [...array, ...value.results]
                        }
                    });
                }
            }
            catch(e) {
                const err = e as AxiosError<BackendResult<NoteListApiResponse>>;
                showError(err.response?.data.message ?? "Something went wrong");
            }
        }

        loadNotes()
    }, [mediaItemId, currentPage]);

    async function handleNoteCreate(noteText: string) {
        try {
            const response = await noteApi.createNote(mediaItemId, noteText);
            const data = response.data;

            if(data.isSuccess && data.data){
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
        catch(e) {
            const err = e as AxiosError<BackendResult<Note>>;

            if(err.response && err.response.data.errors.length > 0) {
                showError(err.response.data.errors[0].message ?? "Something went wrong");
            }
            else {
                showError(err.response?.data.message ?? "Something went wrong");
            }
            console.log(e);
        }
    }

    function handleNoteCreateCancel() {
        setCreateActive(false);
    }

    async function handleNoteDelete(noteId: number) {
        try {
            const response = await noteApi.deleteNote(mediaItemId, noteId);
            const data = response.data;

            if(data.isSuccess) {
                setState(prev => {
                    if(!prev) return prev;

                    return {
                        ...prev,
                        results: prev.results.filter(n => n.id !== noteId)
                    }
                })
                showSuccess("Successfully deleted!")
            }
        }
        catch(e) {
            const err = e as AxiosError<BackendResult<void>>;
            showError(err.response?.data.message ?? "Something went wrong");
        }
    }

    async function handleLoadMore() {
        if(state?.totalPages && currentPage >= state.totalPages) {
            return;
        }

        setCurrentPage(prev => prev + 1);
    }

    if(state == null) {
        return <div>Loading notes...</div>
    }

    return (
        <div className={s.notesSection}>
            <div className={s.notesHeader}>
                <h2><BookOpen size={24}/> My Notes</h2>
                <button className={s.addNoteBtn} onClick={() => setCreateActive(true)}>+ Add Note</button>
            </div>

            <div className={s.notesGrid}>
                {createActive && <NoteItemCreate
                    handleNoteCreate={handleNoteCreate}
                    handleNoteCreateCancel={handleNoteCreateCancel}
                />}
                {state.results.map(note => (<NoteItem key={note.id} note={note} handleNoteDelete={handleNoteDelete}/>))}
                {state.results.length === 0 && <p className={s.emptyNotes}>No notes yet. Start writing!</p>}

            </div>
            {state?.totalPages && currentPage < state.totalPages && <button onClick={handleLoadMore}>Load more</button>}
        </div>
    );
}

export default NoteList;
import axiosClient from "./axiosClient.ts";
import type {BackendResult} from "./types.ts";

export interface NoteListApiResponse {
    results: Note[],
    totalPages: number
}

export interface Note {
    id: number,
    title: string,
    text: string,
    type: NoteType,
    timestamp?: string | null,
    createdAt: string,
}

export interface CreateNote {
    title: string,
    text: string,
    type: NoteType,
    timestamp?: string | null
}

export const NOTE_TYPES = [
    "General",
    "Quote",
    "Music",
    "Goof",
    "Idea"
] as const;

export type NoteType = typeof NOTE_TYPES[number];

export const noteApi = {
    getNotes: async (mediaItemId: number, page: number) => {
        return await axiosClient.get<BackendResult<NoteListApiResponse>>(`media/${mediaItemId}/notes?page=${page}`);
    },
    createNote: async (mediaItemId: number, newNote: CreateNote) => {
        return await axiosClient.post<BackendResult<Note>>(`media/${mediaItemId}/notes`, newNote);
    },
    deleteNote: async (mediaItemId: number, noteId: number) => {
        return await axiosClient.delete<BackendResult<void>>(`media/${mediaItemId}/notes/${noteId}`);
    }
}
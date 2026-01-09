import axiosClient from "./axiosClient.ts";
import type {BackendResult} from "./types.ts";

export interface NoteListApiResponse {
    results: Note[],
    totalPages: number
}

export interface Note {
    id: number,
    text: string,
    createdAt: string,
}

export const noteApi = {
    getNotes: async (mediaItemId: number, page: number) => {
        return await axiosClient.get<BackendResult<NoteListApiResponse>>(`media/${mediaItemId}/notes?page=${page}`);
    },
    createNote: async (mediaItemId: number, text: string) => {
        return await axiosClient.post<BackendResult<Note>>(`media/${mediaItemId}/notes`, {text});
    },
    deleteNote: async (mediaItemId: number, noteId: number) => {
        return await axiosClient.delete<BackendResult<void>>(`media/${mediaItemId}/notes/${noteId}`);
    }
}
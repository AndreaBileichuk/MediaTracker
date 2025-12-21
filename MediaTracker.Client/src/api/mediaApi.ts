import axiosClient from "./axiosClient.ts";
import type {BackendResult} from "./types.ts";

export interface ProvidedMedia {
    id: number;
    title: string;
    overview: string;
    posterPath: string;
    releaseDate: string;
    isAdult: boolean;
}

export interface ProvidedMediaDetails extends ProvidedMedia {
    backdropPath: string;
    genres: Genre[];
    runtime: number;
    status: string;
    tagline: string;
    voteAverage: number;
    voteCount: number;
}

export interface Genre {
    id:number;
    name: string;
}

export type MediaType = "book" | "movie";

export const mediaApi = {
    searchMedia: async (query: string, type: MediaType) => {
        return await axiosClient.get<BackendResult<ProvidedMedia[]>>(`mediaprovider?query=${query}&type=${type}`);
    },

    getMediaById: async (id: number, type: MediaType) => {
        return await axiosClient.get<BackendResult<ProvidedMediaDetails>>(`mediaprovider/${id}?type=${type}`);
    }
};
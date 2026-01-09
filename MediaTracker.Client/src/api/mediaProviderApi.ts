import axiosClient from "./axiosClient.ts";
import type {BackendResult} from "./types.ts";
import type {MediaStatus} from "./myMediaApi.ts";

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
    runtime: number | null;
    status: MediaStatus;
    tagline: string;
    voteAverage: number;
    voteCount: number;
    seasons?: Season[]
}

export interface Season {
    id: number;
    name: string;
    seasonNumber: number;
    episodeCount: number;
    posterPath: string;
    airDate: string;
}

export interface Genre {
    id:number;
    name: string;
}

export interface MediaApiResponse {
    results: ProvidedMedia[],
    totalPages: number
}

export type MediaType = "book" | "movie" | "series";

export const mediaProviderApi = {
    searchMedia: async (query: string, type: MediaType, page: number) => {
        return await axiosClient.get<BackendResult<MediaApiResponse>>(`mediaprovider?page=${page}&query=${query}&type=${type}`);
    },

    getMediaById: async (id: number, type: MediaType) => {
        return await axiosClient.get<BackendResult<ProvidedMediaDetails>>(`mediaprovider/${id}?type=${type}`);
    },

    getTopRated: async (type: MediaType, currentPage: number) => {
        return await axiosClient.get<BackendResult<MediaApiResponse>>(`mediaprovider/top-rated?type=${type}&page=${currentPage}`);
    }
};
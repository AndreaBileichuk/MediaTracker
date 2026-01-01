import axiosClient from "./axiosClient.ts";
import type {BackendResult} from "./types.ts";
import type {MediaType, ProvidedMediaDetails} from "./mediaProviderApi.ts";


export interface MyMediaListApiResponse {
    results: MediaItem[],
    totalPages: number
}

export interface MediaItem {
    id: number,
    title: string,
    posterPath: string,
    type: MediaType,
    status: string,
}

export const myMediaApi = {
    getMedia: async (page: number) => {
        return await axiosClient.get<BackendResult<MyMediaListApiResponse>>(`media?page=${page}`);
    },
    createMedia: async (media: ProvidedMediaDetails, type: MediaType) => {
        return await axiosClient.post<BackendResult<MediaItem>>(`media`, {
            title: media.title,
            posterPath: media.posterPath,
            externalId: media.id,
            type: type
        });
    }
};
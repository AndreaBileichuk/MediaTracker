import axiosClient from "./axiosClient.ts";
import type {BackendResult} from "./types.ts";
import type {MediaApiResponse, MediaType} from "./mediaProviderApi.ts";

export interface MediaItem {
    
}

export const mediaApi = {
    getMedia: async (query: string, type: MediaType, page: number) => {
        return await axiosClient.get<BackendResult<MediaApiResponse>>(`mediaprovider?page=${page}&query=${query}&type=${type}`);
    },
};
import axiosClient from "./axiosClient.ts";
import type {BackendResult} from "./types.ts";
import type {MediaType, ProvidedMediaDetails} from "./mediaProviderApi.ts";

export interface MyMediaListApiResponse {
    results: MediaItem[],
    totalPages: number,
    totalCount: number
}

export interface MediaItem {
    id: number,
    title: string,
    posterPath: string,
    type: MediaType,
    status: MediaStatus,
}

export interface MediaDetails {
    id: number,
    type: MediaType,
    status: MediaStatus,
    userRating: number | null,
    mediaInfo: ProvidedMediaDetails,
}

export const MEDIA_STATUSES = [
    'InProcess',
    'Planned',
    'Completed',
    'Dropped'
] as const;

export type MediaStatus = typeof MEDIA_STATUSES[number];

export type FilterType = 'Active' | MediaStatus;

export const myMediaApi = {
    getMedia: async (page: number, filter: FilterType) => {
        const params : {page: number, status: string | null} = { page, status: null }

        if (filter !== 'Active') {
            params.status = filter;
        }

        return axiosClient.get<BackendResult<MyMediaListApiResponse>>(
            'media',
            { params }
        );
    },
    createMedia: async (media: ProvidedMediaDetails, type: MediaType) => {
        return await axiosClient.post<BackendResult<MediaItem>>(`media`, {
            title: media.title,
            posterPath: media.posterPath,
            externalId: media.id,
            type: type
        });
    },
    getDetails: async (id: string) => {
        return await axiosClient.get<BackendResult<MediaDetails>>(`media/${id}`);
    },
    dropMedia: async (id: number) => {
        return await axiosClient.patch<BackendResult<void>>(`media/drop/${id}`);
    },
    changeStatus: async (id: number, newStatus: string) => {
        return await axiosClient.patch<BackendResult<void>>(`media/${id}/status`, {
            status: newStatus
        });
    },
    deleteMedia: async (id: number) => {
        return await axiosClient.delete<BackendResult<void>>(`media/${id}`);
    },
    rateMedia: async (id: number, score: number) => {
        return await axiosClient.patch<BackendResult<void>>(`media/${id}/rate`, {
            rating: score
        });
    }
};
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
    status: string,
}

export interface MediaDetails {
    id: number,
    type: MediaType,
    status: string,
    userRating: number | null,
    mediaInfo: ProvidedMediaDetails,
}

export type FilterType = 'Active' | 'InProcess' | 'Planned' | 'Completed' | 'Dropped';

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
    }
};
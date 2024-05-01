/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BookmarkSchema } from '../models/BookmarkSchema';
import type { NinjaPaginationResponseSchema_Job_ } from '../models/NinjaPaginationResponseSchema_Job_';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BookmarkService {
    /**
     * Get Bookmarks
     * @param limit
     * @param offset
     * @returns NinjaPaginationResponseSchema_Job_ OK
     * @throws ApiError
     */
    public static getBookmarks(
        limit: number = 100,
        offset?: number,
    ): CancelablePromise<NinjaPaginationResponseSchema_Job_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bookmark',
            query: {
                'limit': limit,
                'offset': offset,
            },
        });
    }
    /**
     * Bookmark Job
     * @param jobid
     * @returns BookmarkSchema OK
     * @throws ApiError
     */
    public static bookmarkJob(
        jobid: number,
    ): CancelablePromise<BookmarkSchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/bookmark',
            query: {
                'jobid': jobid,
            },
        });
    }
    /**
     * Delete Bookmark
     * @param jobId
     * @returns null OK
     * @throws ApiError
     */
    public static deleteBookmark(
        jobId: number,
    ): CancelablePromise<null> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/bookmark',
            query: {
                'job_id': jobId,
            },
        });
    }
}

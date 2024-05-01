/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NinjaPaginationResponseSchema_PageListEntryScema_ } from '../models/NinjaPaginationResponseSchema_PageListEntryScema_';
import type { PageCreateSchema } from '../models/PageCreateSchema';
import type { PageListEntryScema } from '../models/PageListEntryScema';
import type { PageSchema } from '../models/PageSchema';
import type { PageUpdateSchema } from '../models/PageUpdateSchema';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ForumPageService {
    /**
     * List
     * @param category
     * @param limit
     * @param offset
     * @returns NinjaPaginationResponseSchema_PageListEntryScema_ OK
     * @throws ApiError
     */
    public static pageList(
        category: number,
        limit: number = 100,
        offset?: number,
    ): CancelablePromise<NinjaPaginationResponseSchema_PageListEntryScema_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/forum/categories/{category}/pages',
            path: {
                'category': category,
            },
            query: {
                'limit': limit,
                'offset': offset,
            },
        });
    }
    /**
     * Post
     * @param category
     * @param requestBody
     * @returns PageSchema OK
     * @throws ApiError
     */
    public static pageNew(
        category: number,
        requestBody: PageCreateSchema,
    ): CancelablePromise<PageSchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/forum/categories/{category}/pages',
            path: {
                'category': category,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Detail
     * @param category
     * @param page
     * @returns PageListEntryScema OK
     * @throws ApiError
     */
    public static pageDetail(
        category: number,
        page: number,
    ): CancelablePromise<PageListEntryScema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/forum/categories/{category}/pages/{page}',
            path: {
                'category': category,
                'page': page,
            },
        });
    }
    /**
     * Update
     * @param category
     * @param page
     * @param requestBody
     * @returns null OK
     * @throws ApiError
     */
    public static pageUpdate(
        category: number,
        page: number,
        requestBody: PageUpdateSchema,
    ): CancelablePromise<null> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/forum/categories/{category}/pages/{page}',
            path: {
                'category': category,
                'page': page,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete
     * @param category
     * @param page
     * @returns null OK
     * @throws ApiError
     */
    public static pageDelete(
        category: number,
        page: number,
    ): CancelablePromise<null> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/forum/categories/{category}/pages/{page}',
            path: {
                'category': category,
                'page': page,
            },
        });
    }
    /**
     * Html
     * @param category
     * @param page
     * @returns string OK
     * @throws ApiError
     */
    public static pageHtml(
        category: number,
        page: number,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/forum/categories/{category}/pages/{page}/html',
            path: {
                'category': category,
                'page': page,
            },
        });
    }
}

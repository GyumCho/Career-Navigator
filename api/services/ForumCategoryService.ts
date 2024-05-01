/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryCreateSchema } from '../models/CategoryCreateSchema';
import type { CategorySchema } from '../models/CategorySchema';
import type { NinjaPaginationResponseSchema_CategorySchema_ } from '../models/NinjaPaginationResponseSchema_CategorySchema_';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ForumCategoryService {
    /**
     * List
     * @param limit
     * @param offset
     * @returns NinjaPaginationResponseSchema_CategorySchema_ OK
     * @throws ApiError
     */
    public static categoryList(
        limit: number = 100,
        offset?: number,
    ): CancelablePromise<NinjaPaginationResponseSchema_CategorySchema_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/forum/categories',
            query: {
                'limit': limit,
                'offset': offset,
            },
        });
    }
    /**
     * Post
     * @param requestBody
     * @returns CategorySchema OK
     * @throws ApiError
     */
    public static categoryNew(
        requestBody: CategoryCreateSchema,
    ): CancelablePromise<CategorySchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/forum/categories',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Detail
     * @param category
     * @returns CategorySchema OK
     * @throws ApiError
     */
    public static categoryDetail(
        category: number,
    ): CancelablePromise<CategorySchema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/forum/categories/{category}',
            path: {
                'category': category,
            },
        });
    }
}

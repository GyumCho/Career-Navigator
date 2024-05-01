/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommentCreateSchema } from '../models/CommentCreateSchema';
import type { CommentListEntrySchema } from '../models/CommentListEntrySchema';
import type { CommentSchema } from '../models/CommentSchema';
import type { CommentUpdateSchema } from '../models/CommentUpdateSchema';
import type { NinjaPaginationResponseSchema_CommentListEntrySchema_ } from '../models/NinjaPaginationResponseSchema_CommentListEntrySchema_';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ForumCommentService {
    /**
     * List
     * @param category
     * @param page
     * @param limit
     * @param offset
     * @returns NinjaPaginationResponseSchema_CommentListEntrySchema_ OK
     * @throws ApiError
     */
    public static commentList(
        category: number,
        page: number,
        limit: number = 100,
        offset?: number,
    ): CancelablePromise<NinjaPaginationResponseSchema_CommentListEntrySchema_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/forum/categories/{category}/pages/{page}/comments',
            path: {
                'category': category,
                'page': page,
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
     * @param page
     * @param requestBody
     * @returns CommentSchema OK
     * @throws ApiError
     */
    public static commentNew(
        category: number,
        page: number,
        requestBody: CommentCreateSchema,
    ): CancelablePromise<CommentSchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/forum/categories/{category}/pages/{page}/comments',
            path: {
                'category': category,
                'page': page,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Detail
     * @param category
     * @param page
     * @param comment
     * @returns CommentListEntrySchema OK
     * @throws ApiError
     */
    public static commentDetail(
        category: number,
        page: number,
        comment: number,
    ): CancelablePromise<CommentListEntrySchema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/forum/categories/{category}/pages/{page}/comments/{comment}',
            path: {
                'category': category,
                'page': page,
                'comment': comment,
            },
        });
    }
    /**
     * Update
     * @param category
     * @param page
     * @param comment
     * @param requestBody
     * @returns null OK
     * @throws ApiError
     */
    public static commentUpdate(
        category: number,
        page: number,
        comment: number,
        requestBody: CommentUpdateSchema,
    ): CancelablePromise<null> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/forum/categories/{category}/pages/{page}/comments/{comment}',
            path: {
                'category': category,
                'page': page,
                'comment': comment,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete
     * @param category
     * @param page
     * @param comment
     * @returns null OK
     * @throws ApiError
     */
    public static commentDelete(
        category: number,
        page: number,
        comment: number,
    ): CancelablePromise<null> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/forum/categories/{category}/pages/{page}/comments/{comment}',
            path: {
                'category': category,
                'page': page,
                'comment': comment,
            },
        });
    }
    /**
     * Html
     * @param category
     * @param page
     * @param comment
     * @returns string OK
     * @throws ApiError
     */
    public static commentHtml(
        category: number,
        page: number,
        comment: number,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/forum/categories/{category}/pages/{page}/comments/{comment}/html',
            path: {
                'category': category,
                'page': page,
                'comment': comment,
            },
        });
    }
}

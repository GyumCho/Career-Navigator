/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FeedbackRequestSchema } from '../models/FeedbackRequestSchema';
import type { JobApplicationCreateSchema } from '../models/JobApplicationCreateSchema';
import type { JobApplicationSchema } from '../models/JobApplicationSchema';
import type { NinjaPaginationResponseSchema_ApplicationOut_ } from '../models/NinjaPaginationResponseSchema_ApplicationOut_';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ApplicationService {
    /**
     * List Applications
     * @param limit
     * @param offset
     * @returns NinjaPaginationResponseSchema_ApplicationOut_ OK
     * @throws ApiError
     */
    public static listApplications(
        limit: number = 100,
        offset?: number,
    ): CancelablePromise<NinjaPaginationResponseSchema_ApplicationOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/jobs/applications',
            query: {
                'limit': limit,
                'offset': offset,
            },
        });
    }
    /**
     * Create
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static createApplication(
        requestBody: JobApplicationCreateSchema,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/jobs/applications/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get Applications
     * @param username
     * @returns JobApplicationSchema OK
     * @throws ApiError
     */
    public static getApplications(
        username: string,
    ): CancelablePromise<Array<JobApplicationSchema>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/jobs/applications/get-by-username/{username}',
            path: {
                'username': username,
            },
        });
    }
    /**
     * Get Application
     * @param id
     * @returns JobApplicationSchema OK
     * @throws ApiError
     */
    public static getApplication(
        id: number,
    ): CancelablePromise<JobApplicationSchema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/jobs/applications/get-by-id/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update Progress
     * @param id
     * @param requestBody
     * @returns JobApplicationSchema OK
     * @throws ApiError
     */
    public static setFeedback(
        id: number,
        requestBody: FeedbackRequestSchema,
    ): CancelablePromise<JobApplicationSchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/jobs/applications/set-feedback/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}

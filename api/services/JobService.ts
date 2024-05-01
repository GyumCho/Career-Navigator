/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Job } from '../models/Job';
import type { JobCreateSchema } from '../models/JobCreateSchema';
import type { NinjaPaginationResponseSchema_Job_ } from '../models/NinjaPaginationResponseSchema_Job_';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class JobService {
    /**
     * Find One
     * @param id
     * @returns Job OK
     * @throws ApiError
     */
    public static findOne(
        id: number,
    ): CancelablePromise<Job> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/jobs/by-id/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * List Jobs
     * @param limit
     * @param offset
     * @returns NinjaPaginationResponseSchema_Job_ OK
     * @throws ApiError
     */
    public static list(
        limit: number = 100,
        offset?: number,
    ): CancelablePromise<NinjaPaginationResponseSchema_Job_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/jobs',
            query: {
                'limit': limit,
                'offset': offset,
            },
        });
    }
    /**
     * Get Recommended
     * @returns any OK
     * @throws ApiError
     */
    public static recommended(): CancelablePromise<(Array<Job> | null)> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/jobs/recommended',
        });
    }
    /**
     * Get Jobs
     * @param search
     * @param company
     * @returns Job OK
     * @throws ApiError
     */
    public static searchJobs(
        search: string,
        company: string = '',
    ): CancelablePromise<Array<Job>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/jobs/search',
            query: {
                'search': search,
                'company': company,
            },
        });
    }
    /**
     * Create
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static createJob(
        requestBody: JobCreateSchema,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/jobs/manage/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}

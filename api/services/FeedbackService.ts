/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FeedbackSchema } from '../models/FeedbackSchema';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FeedbackService {
    /**
     * New
     * @param instruction
     * @param feedback
     * @returns FeedbackSchema OK
     * @throws ApiError
     */
    public static feedbackNew(
        instruction: string,
        feedback: string,
    ): CancelablePromise<FeedbackSchema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/feedback/newFeedback',
            query: {
                'instruction': instruction,
                'feedback': feedback,
            },
        });
    }
    /**
     * Checkbox
     * @param feedbackId
     * @returns FeedbackSchema OK
     * @throws ApiError
     */
    public static checkbox(
        feedbackId: number,
    ): CancelablePromise<FeedbackSchema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/feedback/modifyCheck',
            query: {
                'feedback_id': feedbackId,
            },
        });
    }
}

/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlainStringPayload } from '../models/PlainStringPayload';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MarkdownService {
    /**
     * Render Markdown
     * @param requestBody
     * @returns string OK
     * @throws ApiError
     */
    public static markdownRender(
        requestBody: PlainStringPayload,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/markdown/render',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}

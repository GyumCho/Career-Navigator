/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ManualCreateResponse } from '../models/ManualCreateResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class QuestionService {
    /**
     * Result
     * @param mbtiType
     * @param codeOne
     * @param codeTwo
     * @param categoryOne
     * @param categoryTwo
     * @param categoryThree
     * @returns ManualCreateResponse OK
     * @throws ApiError
     */
    public static questionResult(
        mbtiType: string,
        codeOne: string,
        codeTwo: string,
        categoryOne: string,
        categoryTwo: string,
        categoryThree: string,
    ): CancelablePromise<ManualCreateResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/results/result',
            query: {
                'MbtiType': mbtiType,
                'codeOne': codeOne,
                'codeTwo': codeTwo,
                'category_one': categoryOne,
                'category_two': categoryTwo,
                'category_three': categoryThree,
            },
        });
    }
}

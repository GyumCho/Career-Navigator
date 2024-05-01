/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TipSchema } from '../models/TipSchema';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TipService {
    /**
     * Newtip
     * Create a new tip
     *
     * :param description: The description of the new tip
     * :param url: The URL associated with the new tip
     * :return: The complete created tip instance
     * @param description
     * @param url
     * @returns TipSchema OK
     * @throws ApiError
     */
    public static tipNew(
        description: string,
        url: string,
    ): CancelablePromise<TipSchema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/tip/newTip',
            query: {
                'description': description,
                'url': url,
            },
        });
    }
    /**
     * Deletetip
     * @param tipId
     * @returns null OK
     * @throws ApiError
     */
    public static tipDelete(
        tipId: number,
    ): CancelablePromise<null> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/tip/deleteTip/{tip_id}',
            path: {
                'tip_id': tipId,
            },
        });
    }
    /**
     * Edittip
     * @param tipId
     * @param description
     * @param url
     * @returns TipSchema OK
     * @throws ApiError
     */
    public static tipEdit(
        tipId: number,
        description: string,
        url: string,
    ): CancelablePromise<TipSchema> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/tip/editTip/{tip_id}',
            path: {
                'tip_id': tipId,
            },
            query: {
                'description': description,
                'url': url,
            },
        });
    }
    /**
     * All Tips
     * @returns TipSchema OK
     * @throws ApiError
     */
    public static tipAll(): CancelablePromise<Array<TipSchema>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/tip/allTips',
        });
    }
}

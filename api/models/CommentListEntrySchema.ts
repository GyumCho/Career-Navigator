/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserSchema } from './UserSchema';
export type CommentListEntrySchema = {
    owner: UserSchema;
    id?: (number | null);
    page: number;
    description: string;
    created_at: string;
    updated_at: string;
};


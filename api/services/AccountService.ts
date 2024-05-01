/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContactItem } from '../models/ContactItem';
import type { EducationItem } from '../models/EducationItem';
import type { GoalSchema } from '../models/GoalSchema';
import type { PlainStringPayload } from '../models/PlainStringPayload';
import type { ProfileSchema } from '../models/ProfileSchema';
import type { UserSchema } from '../models/UserSchema';
import type { WorkExperienceItem } from '../models/WorkExperienceItem';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AccountService {
    /**
     * Get Mentor
     * Get the assigned mentor for the current user
     *
     * :param request: The original HTTP request
     * :return: the mentor
     * @returns any OK
     * @throws ApiError
     */
    public static getMontor(): CancelablePromise<(UserSchema | null)> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mentor/mymentor',
        });
    }
    /**
     * Get Mentees
     * List all the mentees for the current user
     *
     * :param request: The original HTTP request
     * :return: a list of mentees
     * @returns UserSchema OK
     * @throws ApiError
     */
    public static getMentees(): CancelablePromise<Array<UserSchema>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mentor/mentees',
        });
    }
    /**
     * Get Empty
     * Get a list of users that are wanting for a mentor
     *
     * :return: list of users wanting a mentor
     * @returns UserSchema OK
     * @throws ApiError
     */
    public static nomemtor(): CancelablePromise<Array<UserSchema>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mentor/nomentor',
        });
    }
    /**
     * Accept
     * Accept a user as a mentor
     *
     * :param request: The original HTTP request
     * :param username: the username of the user to accept
     * :return: a full instance of the accepted user
     * @param username
     * @returns UserSchema OK
     * @throws ApiError
     */
    public static accept(
        username: string,
    ): CancelablePromise<UserSchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/mentor/accept',
            query: {
                'username': username,
            },
        });
    }
    /**
     * Goal
     * Update the goals for the currently logged in user
     *
     * :param request: The original HTTP request
     * :param short_goal: The short-term goal of this user
     * :param long_goal: The long-term goal of this user
     * :param motivation1: The contents of the first motivation field
     * :param motivation2: The contents of the second motivation field
     * :param motivation3: The contents of the third motivation field
     * :return: The new user
     * @param shortGoal
     * @param longGoal
     * @param motivation1
     * @param motivation2
     * @param motivation3
     * @returns UserSchema OK
     * @throws ApiError
     */
    public static goal(
        shortGoal: string,
        longGoal: string,
        motivation1: string,
        motivation2: string,
        motivation3: string,
    ): CancelablePromise<UserSchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/mentor/goalMotivation',
            query: {
                'short_goal': shortGoal,
                'long_goal': longGoal,
                'motivation1': motivation1,
                'motivation2': motivation2,
                'motivation3': motivation3,
            },
        });
    }
    /**
     * New
     * @param username
     * @param password
     * @param email
     * @param lastName
     * @param firstName
     * @param isMentor
     * @returns ProfileSchema OK
     * @throws ApiError
     */
    public static accountNew(
        username: string,
        password: string,
        email: string,
        lastName: string,
        firstName: string,
        isMentor: boolean,
    ): CancelablePromise<ProfileSchema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/account/new',
            query: {
                'username': username,
                'password': password,
                'email': email,
                'last_name': lastName,
                'first_name': firstName,
                'is_mentor': isMentor,
            },
        });
    }
    /**
     * Profile
     * @param user
     * @returns ProfileSchema OK
     * @throws ApiError
     */
    public static accountProfile(
        user: (string | number),
    ): CancelablePromise<ProfileSchema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/account/by-username/{user}',
            path: {
                'user': user,
            },
        });
    }
    /**
     * Goals
     * @param user
     * @returns GoalSchema OK
     * @throws ApiError
     */
    public static getUserGoals(
        user: (string | number),
    ): CancelablePromise<GoalSchema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/account/by-username/{user}/goals',
            path: {
                'user': user,
            },
        });
    }
    /**
     * Update
     * @param interest
     * @param skill
     * @param others
     * @param requestBody
     * @returns UserSchema OK
     * @throws ApiError
     */
    public static accountUpdate(
        interest: string,
        skill: string,
        others: string,
        requestBody: {
            education: Array<EducationItem>;
            work_experience: Array<WorkExperienceItem>;
            contact: Array<ContactItem>;
        },
    ): CancelablePromise<UserSchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/account/update',
            query: {
                'interest': interest,
                'skill': skill,
                'others': others,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Download Pdf
     * @param username
     * @returns string OK
     * @throws ApiError
     */
    public static generatePdf(
        username: string,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/resume/download/{username}',
            path: {
                'username': username,
            },
        });
    }
    /**
     * Upload Pdf
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static uploadPdf(
        requestBody: PlainStringPayload,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/resume/upload',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}

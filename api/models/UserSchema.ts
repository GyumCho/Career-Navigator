/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserSchema = {
    id?: (number | null);
    last_login?: (string | null);
    /**
     * Designates that this user has all permissions without explicitly assigning them.
     */
    is_superuser?: boolean;
    /**
     * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
     */
    username: string;
    first_name?: (string | null);
    last_name?: (string | null);
    email?: (string | null);
    /**
     * Designates whether the user can log into this admin site.
     */
    is_staff?: boolean;
    /**
     * Designates whether this user should be treated as active. Unselect this instead of deleting accounts.
     */
    is_active?: boolean;
    date_joined?: string;
    is_jobseeker?: boolean;
    is_mentor?: boolean;
    employer?: (number | null);
    education?: Record<string, any>;
    work_experience?: Record<string, any>;
    contact?: Record<string, any>;
    interest?: (string | null);
    skill?: (string | null);
    others?: (string | null);
    motivation1?: (string | null);
    motivation2?: (string | null);
    motivation3?: (string | null);
    short_goal?: (string | null);
    long_goal?: (string | null);
    resume_pdf?: (string | null);
    complete_question?: boolean;
    mentor?: (number | null);
    /**
     * The groups this user belongs to. A user will get all permissions granted to each of their groups.
     */
    groups: Array<number>;
    /**
     * Specific permissions for this user.
     */
    user_permissions: Array<number>;
};


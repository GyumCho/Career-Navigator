import React from "react";
import { createDrawerNavigator, DrawerNavigationProp } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { Job } from "../api";

export type MainDrawerProps = {
    Home: {},
    Profile: {},
    JobList: {},
    JobDetails: {
        job: Job,
    },
    Resume: {},
    MentorMatching: {},
    JobPosting: {},
    questionnaire_intro: {},
    questionnaire_MBTI: {},
    questionnaire_Holland: {
        MBTI_res: (0 | 1)[],
    },
    questionnaire_end: {
        MBTI_res: any,
        Holland_res: any,
    },
    QuestionsResults: {
        mbtiType: string,
        codeOne: string,
        codeTwo: string,
    },
    ApplicationProcess: {},
    GoalMotivationInput: {},
    Forum: {},
    Stats: {},
    MentorStudents: {},
    ViewMentor: {},
    PostTips: {},
};

export const MainDrawerContext = React.createContext<DrawerNavigationProp<MainDrawerProps>|undefined>(undefined);
export const MainDrawer = createDrawerNavigator<MainDrawerProps>();

export type AuthStackProps = {
    'Intro': {},
    'Login': {},
    'CreateAccount': {},
}
export const AuthStack = createStackNavigator<AuthStackProps>();

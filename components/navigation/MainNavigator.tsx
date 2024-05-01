import React from "react";
import JobPosting from "../jobs/JobPosting.tsx";
import { MainDrawer, MainDrawerProps } from "../../util/nav";
import Profile from "../Profile";
import JobList from "../jobs/JobList";
import JobDetails from "../jobs/JobDetails";
import ResumeCreation from "../ResumeCreation";
import MentorRequests from "../MentorRequests";
import Questionnaire from "../questionnaire/Questionnaire";
import Questionnaire_Intro from "../questionnaire/Questionnaire_Intro";
import ViewMentor from "../ViewMentor";
import PostTips from "../tips/PostTips";
import MentorStudents from "../MentorStudents";
import QuestionsResults from "../questionnaire/QuestionsResults";
import Questionnaire_end from "../questionnaire/Questionnaire_end";
import Questionnaire_holland from "../questionnaire/Questionnaire_holland";
import { ForumStackNavigator } from "../forum";
import Stats from "../Stats";
import CustomDrawer from "./CustomDrawer";
import { useAuthState } from "../../context/authcontext";
import Home from "../Home";
import GoalMotivationInput from "../questionnaire/GoalMotivationInput.tsx";
import { ApplicationProcess } from "../applications/AllApplications.tsx";
import { useTheme } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";

const MainNavigator: React.FC<{initialRouteName: keyof MainDrawerProps}> = ({initialRouteName}) => {

  // alternative: pass as argument...
  const { isMentor } = useAuthState();
  const theme = useTheme();
  return <NavigationContainer>
    <MainDrawer.Navigator initialRouteName={initialRouteName} screenOptions={{headerShown: true}} drawerContent={(props) => <CustomDrawer props={props} />}>
       {isMentor ? (
        <MainDrawer.Group>
          <MainDrawer.Screen name="Home" component={Home}
                options={{title: 'Home',
                  headerStyle:{backgroundColor:theme.colors.primary},
                  headerTitleStyle:{ color:'white'},
                  headerTintColor: 'white'}} />
          <MainDrawer.Screen name="Profile" component={Profile} options={{title: 'Your Profile'}} />
          <MainDrawer.Screen name="JobPosting" component={JobPosting} options={{title: 'Post a new Job Vacancy'}} />
          <MainDrawer.Screen name="MentorStudents" component={MentorStudents} options={{title: 'Your Students'}} />
          <MainDrawer.Screen name="MentorMatching" component = {MentorRequests} options={{title: 'Student Match Requests'}} />
          <MainDrawer.Screen name="Forum" component={ForumStackNavigator} options={{title: 'Forum'}} />
          <MainDrawer.Screen name="PostTips" component={PostTips} options={{title: 'Post Tips and Tricks'}} />
        </MainDrawer.Group>
       ) :
       <MainDrawer.Group>
        <MainDrawer.Screen name="Home" component={Home}
        options={{title: 'Home',
                  headerStyle:{backgroundColor:theme.colors.primary},
                  headerTitleStyle:{ color:'white'},
                  headerTintColor: 'white'}} />
        <MainDrawer.Screen name="Profile" component={Profile} options={{title: 'Your Profile'}} />
        <MainDrawer.Screen name="JobList" component={JobList} options={{title: 'Jobs',
        headerStyle:{backgroundColor:theme.colors.primary},
                  headerTitleStyle:{ color:'white'},
                  headerTintColor: 'white'}} />
        <MainDrawer.Screen name="JobDetails" component={JobDetails} options={{title: 'Job Details'}} />
        <MainDrawer.Screen name="Resume" component={ResumeCreation} options={{title: 'Resume'}} />


        <MainDrawer.Screen name="Stats" component={Stats} options={{title: '', headerStyle:{backgroundColor:theme.colors.primaryContainer},
                  headerTitleStyle:{ color:theme.colors.primary},
                  headerTintColor: theme.colors.primary}}
         />
        <MainDrawer.Screen name="questionnaire_intro" component={Questionnaire_Intro} options = {{headerShown : false}}/>
        <MainDrawer.Screen name="questionnaire_MBTI" component={Questionnaire} options = {{headerShown : false}}/>
        <MainDrawer.Screen name="questionnaire_Holland" component={Questionnaire_holland} options = {{headerShown : false}}/>
        <MainDrawer.Screen name="questionnaire_end" component={Questionnaire_end} options = {{headerShown : false}}/>
        <MainDrawer.Screen name="ApplicationProcess" component={ApplicationProcess} options = {{title: "Your Applications"}}/>
        <MainDrawer.Screen name="QuestionsResults" component={QuestionsResults} options={{headerShown: false}}/>
        <MainDrawer.Screen name="GoalMotivationInput" component={GoalMotivationInput} options = {{title: "Goals and Motivations"}}/>
        <MainDrawer.Screen name="Forum" component={ForumStackNavigator} options={{title: 'Forum'}} />

        <MainDrawer.Screen name="ViewMentor" component={ViewMentor} options={{title: 'My Mentor'}} />
        <MainDrawer.Screen name="PostTips" component={PostTips} options={{title: 'View Tips and Tricks'}} />
      </MainDrawer.Group>
       }
    </MainDrawer.Navigator>
  </NavigationContainer>;
};

export default MainNavigator;

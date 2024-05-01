import React, { useEffect } from "react";
import AuthNavigator from "./AuthNavigator";
import { useAuthDispatch, useAuthState } from "../../context/authcontext";
import MainNavigator from "./MainNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { doRefresh } from "../../util/auth";
import { AccountService, OpenAPI } from "../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";


const AppNavigator : React.FC = () => {
    const { userToken, firstTime } = useAuthState();
    const dispatch = useAuthDispatch();

    useEffect(()=>{
        const refresh = async () => {
          let token = null;
          try {
            await doRefresh();
            token = OpenAPI.TOKEN;

            // Temp solution
            let username = await AsyncStorage.getItem('username');
            const user = await AccountService.accountProfile(username || "");
            dispatch({ type: 'RESTORE_TOKEN', isMentor: user.is_mentor, token: token as string });
          } catch (error: any) {

          }
        };
        refresh();
    }, [dispatch]);

    return (
        <SafeAreaProvider>
          {
            userToken == null
              ? <AuthNavigator />
              : <MainNavigator initialRouteName={
                firstTime
                  ? "questionnaire_intro"
                  : "Home"
              } />
          }
        </SafeAreaProvider>
    );
};

export default AppNavigator;

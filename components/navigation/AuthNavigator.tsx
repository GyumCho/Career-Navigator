import Intro from "../Intro";
import Login from "../Login";
import CreateAccount from "../CreateAccount";
import React from "react";
import { AuthStack } from "../../util/nav.ts";
import { NavigationContainer } from "@react-navigation/native";

const AuthNavigator : React.FC = () => {
    return <NavigationContainer>
        <AuthStack.Navigator initialRouteName="Intro" screenOptions={{headerShown: false}}>
            <AuthStack.Screen name="Intro" component={Intro}/>
            <AuthStack.Screen name="Login" component={Login}/>
            <AuthStack.Screen name="CreateAccount" component={CreateAccount}/>
        </AuthStack.Navigator>
    </NavigationContainer>;
};

export default AuthNavigator;

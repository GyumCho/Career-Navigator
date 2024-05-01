import React from "react";
import { AppRegistry } from "react-native";
import { OpenAPI } from "./api";
import {MD3LightTheme as DefaultTheme, PaperProvider } from "react-native-paper";
import Config from "react-native-config";
import { AuthProvider } from './context/authcontext.tsx';
import AppNavigator from "./components/navigation/AppNavigator.tsx";

AppRegistry.registerComponent('CareerNavigator', () => App);

const IP = Config.API_URL; // Change this to your local IP address
OpenAPI.BASE = "http://" + IP + ":8000";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
  },
};



const App = () => {
  return (
    <AuthProvider>
      <PaperProvider theme={theme}>
          <AppNavigator />
      </PaperProvider>
    </AuthProvider>
  );
};

export default App;

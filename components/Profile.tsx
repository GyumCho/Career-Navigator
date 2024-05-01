import 'react-native-gesture-handler';
import React, { useEffect } from "react";
import { Alert, StyleSheet, View, AppRegistry, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Userpic } from "react-native-userpic";
import { AccountService } from "../api";
import { logout } from "../util/auth.ts";
import { useApi } from "../util/api.tsx";
import { Button, useTheme, Text } from 'react-native-paper';
import { useAuthDispatch, useAuthState } from '../context/authcontext.tsx';
import { DrawerScreenProps } from "@react-navigation/drawer";
import { MainDrawerProps } from "../util/nav.ts";

AppRegistry.registerComponent('CareerNavigator', () => Profile);


const Profile: React.FC<DrawerScreenProps<MainDrawerProps, 'Profile'>> = ({}) => {
  const dispatch = useAuthDispatch();
  const {} = useAuthState();
  const handleLogout = async () => {
    Alert.alert("Logout?", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: async () => {
          await logout();
          await AsyncStorage.removeItem("username");
          await AsyncStorage.removeItem('refresh-token');
          dispatch({ type: 'SIGN_OUT' });
        },
      },
    ]);
  };
  const theme = useTheme();
  const [userInfoResponse, getUserInfo] =
    useApi(AccountService.accountProfile);

  useEffect(() => {
    (async () => {
      let username = await AsyncStorage.getItem('username');
      if (username) {
        await getUserInfo(username);
      }
    })().catch(console.error);
  }, [getUserInfo]);


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      fontSize: 30,
      fontWeight: "bold",
      color: "white",
      marginBottom: 20,
    },
    profileContainer: {
      backgroundColor: theme.colors.primaryContainer,
      borderRadius: 20,
      padding: 20,
      alignItems: "center",
      marginBottom: 20,
    },
    label: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.onPrimaryContainer,
      marginBottom: 10,
    },
    name: {
      fontSize: 24,
      color: theme.colors.primary,
      margin: 10,
      fontWeight: "bold",
    },
    info: {
      fontSize: 18,
      color: theme.colors.onPrimaryContainer,
      marginBottom: 10,
    },
    wrapper: {
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      margin: 25,
    },
    drawerButton: {
      color: "white",
      fontSize: 50,
      marginBottom: 20,
      position: "relative",
      left: -150,
      top: -125,
    },
  });

  if (userInfoResponse.state === "initial" || userInfoResponse.state === "fetching") {
    return <View style={styles.container}>
      <ActivityIndicator size={"large"} />
    </View>;
  } else if (userInfoResponse.state === "success") {
    const userInfo = userInfoResponse.response;
    const message = userInfo.first_name !== "" ? `Hello, ${userInfo.first_name} ${userInfo.last_name}!` : "Hello!";
    return (
      <View style={styles.container}>
        <Text variant="bodyLarge" style={styles.name}>{message}</Text>
        <View style={styles.wrapper}>
          <Userpic
            email={userInfo.email}
            size={125}
          />
        </View>
        <View style={styles.profileContainer}>
          <Text style={styles.label}>Username:</Text>
            <Text style={styles.info}>{userInfo.username}</Text>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.info}>{userInfo.email}</Text>
        </View>
        <Button style={{backgroundColor:theme.colors.error} } onPress={() => handleLogout()} mode={"contained"} icon={'logout'}>
            Log Out
        </Button>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text style={{color: 'red'}}>Error loading profile information!</Text>
        <Text style={{color: 'red'}}>Cause: { userInfoResponse.error.name }</Text>
        <Text style={{color: 'red'}}>{ userInfoResponse.error.message }</Text>
      </View>
    );
  }
};

export default Profile;

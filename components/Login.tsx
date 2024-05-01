import React, { useState } from "react";
import { StyleSheet, View, AppRegistry, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doLogin, InvalidCredentialsError } from "../util/auth.ts";
import { Button, TextInput, Text, useTheme, IconButton } from "react-native-paper";
import { AuthStackProps } from "../util/nav.ts";
import { StackScreenProps } from "@react-navigation/stack";
import { useAuthDispatch } from "../context/authcontext.tsx";
import { AccountService, OpenAPI } from "../api";

AppRegistry.registerComponent("CareerNavigator", () => Login);

const Login: React.FC<StackScreenProps<AuthStackProps, "Login">> = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const checkValid = (username1: string, password1: string) => {
    return username1.length > 0 && password1.length > 0 && !username1.includes(" ") && !password1.includes(" ");
  };

  const dispatch = useAuthDispatch();

  const handleConfirm = async () => {
    const newErrors: { [key: string]: string } = {};
    if (checkValid(username, password)) {
      try {
        const loginResult =
          await doLogin(username, password);
        await AsyncStorage.setItem("username", loginResult.username);
        await AsyncStorage.setItem("refresh-token", loginResult.refresh);
        setPassword("");
        setUsername("");
        setIsPasswordVisible(false);
        setErrors({});

        // temp
        const user = await AccountService.accountProfile(username);
        dispatch({ type: 'SIGN_IN',isMentor: user.is_mentor, token:  OpenAPI.TOKEN as string});
      } catch (error) {
        if (error instanceof InvalidCredentialsError) {
          newErrors.credentials = "Invalid Credentials! Try again";
          setPassword("");
          setErrors(newErrors);
        } else {
          newErrors.credentials = "Error! Try again";
          setErrors(newErrors);
          throw error;
        }
      }
    } else {
      newErrors.credentials = "Whoops! Looks like you forgot to fill in all the fields";
      setErrors(newErrors);
    }
  };

  const theme = useTheme();
  const styles = StyleSheet.create({
    topContainer: {
      margin: 20,
      marginBottom: 30,
    },
    subTitle: {
      fontWeight: "bold",
      color: theme.colors.primary,
      marginBottom: 20,
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.primaryContainer,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.primary,
    },
    loginTitle: {
      fontSize: 40,
      fontWeight: "bold",
      textAlign: "center",
      color: "white",
    },
    inputContainer: {
      margin: 20,
      position: "relative",
    },
    loginContainer: {
      backgroundColor: "white",
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      padding: 30,
      height: 100,
      borderTopRightRadius: 30,
      borderTopLeftRadius: 30,
    },
    loginInput: {
      backgroundColor: theme.colors.secondaryContainer,
      width: 300,
      color: "black",
      marginBottom: 20,
    },
    buttonLogin: {
      width: 230,
      marginBottom: 10,
    },
    input: {
      backgroundColor: "lightgray",
      width: 200,
      height: 50,
      color: "black",
      borderRadius: 20,
    },
    button: {
      borderRadius: 10,
      padding: 0,
      width: 150,
      alignItems: "center",
      justifyContent: "center",
      height: 40,
      position: "relative",

    },
    bottomText: {
      position: "relative",
      top: 20,
    },
    eyeIconContainer: {
      position: "absolute",
      right: 10,
      top: 15,
    },
    eyeIconText: {
      fontSize: 12,
      color: "gray",
    },
  });

  const handleUsername = (text: string) => {
    setUsername(text.replace(/\s/g, ""));
  };

  const handlePassword = (text: string) => {
    setPassword(text.replace(/\s/g, ""));
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: 'white' }}>
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Text variant="bodyLarge" style={styles.title}>Hello,</Text>
          <Text variant="displaySmall" style={styles.subTitle}>Sign In</Text>
        </View>

        <View style={styles.loginContainer}>
          <TextInput style={
            {
              backgroundColor: theme.colors.secondaryContainer,
              width: 300,
              color: "black",
              margin: 20,
            }
          }
                     placeholder="Username"
                     onChangeText={handleUsername}
                     value={username}
          />
          <View style={{ flexDirection: "row", width: 300, marginBottom: 15 }}>
            <TextInput style={
              {
                backgroundColor: theme.colors.secondaryContainer,
                width: 300,
                color: "black",
                paddingRight: 35,
              }
            }
                       placeholder="Password"
                       secureTextEntry={!isPasswordVisible}
                       onChangeText={handlePassword}
                       value={password}
                       autoCapitalize="none"
            />
            <IconButton
              icon={isPasswordVisible ? "eye" : "eye-off"}
              onPress={() => setIsPasswordVisible(prevState => !prevState)}
              style={{
                position: "absolute",
                right: 0,
              }}
            />
          </View>
          {
            errors.credentials ? (
              <Text style={{ color: theme.colors.error }}>{errors.credentials}</Text>) : null
          }
          <View>
            {/*<Button mode={"text"}>*/}
            {/*  <Text style={{ marginBottom: 10 }}>Forgot password?</Text>*/}
            {/*</Button>*/}
          </View>
          <Button style={styles.buttonLogin} onPress={handleConfirm}
                  mode="contained">Login</Button>


          {/* TODO: make the "forgot password" link work */}
          <Button style={styles.buttonLogin} mode="outlined" onPress={() => navigation.navigate("CreateAccount", {})}>Sign
            Up
            Instead
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};


export default Login;

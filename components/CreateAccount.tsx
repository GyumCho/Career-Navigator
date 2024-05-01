import React, { useState } from "react";
import { Alert, StyleSheet, View, AppRegistry, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AccountService, OpenAPI } from "../api";
import { Text, TextInput, Button, useTheme, IconButton } from "react-native-paper";
import { doLogin } from "../util/auth.ts";
import { AuthStackProps } from "../util/nav.ts";
import { StackScreenProps } from "@react-navigation/stack";
import { useAuthDispatch } from "../context/authcontext.tsx";

AppRegistry.registerComponent("CareerNavigator", () => CreateAccount);

const CreateAccount: React.FC<StackScreenProps<AuthStackProps, 'CreateAccount'>> = ({  }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordConfirmVisible, setIsPasswordConfirmVisible] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const dispatch = useAuthDispatch();
  const validator = require("email-validator");

  const handleSubmit = async () => {
    await storeData();
    if (isFormValid()) {
      AccountService.accountNew(username, password, email, lastName, firstName, false).then(() => {

        doLogin(username, password).then(async () => {
          const user = await AccountService.accountProfile(username);
          dispatch({ type: 'SIGN_UP',isMentor: user.is_mentor, token:  OpenAPI.TOKEN as string});
        });
      }).catch((error) => {
        if (error.message === "Internal Server Error") {
          setErrors({
            username: "This username is already in use.",
          });
        } else {
          Alert.alert("Network Error", "Please check your internet connection.");
        }
      });
    }
  };

  const isFormValid = () => {
    let newErrors: { [key: string]: string } = {};
    if (!isNameValid(firstName)) {
      newErrors.firstName = "First name must contain only letters or have more than 2 spaces or hyphens between characters.";
    }
    if (!isNameValid(lastName)) {
      newErrors.lastName = "Last name must contain only letters or have more than 2 spaces or hyphens between characters.";
    }
    if (username.includes(" ") || username.length <= 0) {
      newErrors.username = "Username cannot be blank or contain spaces.";
    }
    if (password.includes(" ") || password.length <= 0) {
      newErrors.password = "Password cannot be blank or contain spaces.";
    }
    if (!checkPasswordStrength(password)) {
      newErrors.passwordStrength = "Password must be at least 8 characters, have a number, and both upper and lower case letters.";
    }
    if (!checkValidEmail(email)) {
      newErrors.email = "Invalid email address format.";
    }
    if (!checkPassword(password, confirmPassword)) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const storeData = async () => {
    try {
      await AsyncStorage.setItem("username", username);
      await AsyncStorage.setItem("password", password);
    } catch (e) {
      console.error("Error saving data", e);
      Alert.alert("System Error! Try again.");
    }

  };

  const checkPassword = (password1: string, confirmPassword1: string) => {
    return password1 === confirmPassword1;
  };

  const checkPasswordStrength = (newPassword: string) => {
    const hasLowercase = /[a-z]/.test(newPassword);
    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasDigit = /\d/.test(newPassword);
    const isLongEnough = newPassword.length >= 8;

    return hasLowercase && hasUppercase && hasDigit && isLongEnough;
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsPasswordConfirmVisible(!isPasswordConfirmVisible);
  };

  const checkValidEmail = (email1: string) => {
    return validator.validate(email1);
  };


  const handlePassword = (text: string) => {
    setPassword(text.replace(/\s/g, ""));
  };

  const handleConfirmPassword = (text: string) => {
    setConfirmPassword(text.replace(/\s/g, ""));
  };

  const handleUsername = (text: string) => {
    setUsername(text.replace(/\s/g, ""));
  };

  const isNameValid = (name: string) => {
    return /^[a-zA-Z]+([-\s]?[a-zA-Z]+)*$/.test(name);
  };


  const theme = useTheme();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.primaryContainer,
    },
    title: {
      marginTop: 20,
      fontWeight: "bold",
      color: theme.colors.primary,
    },
    subTitle: {
      fontWeight: "bold",
      color: theme.colors.primary,
      marginBottom: 20,
    },
    loginContainer: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "white",
      padding: 20,
      borderTopRightRadius: 30,
      borderTopLeftRadius: 30,
      alignItems: "center",
    },
    topContainer: {
      margin: 20,
      marginBottom: 50,
    },
    inputContainer: {
      margin: 10,
    },
    input: {
      paddingHorizontal: 10,
      backgroundColor: theme.colors.secondaryContainer,
      width: 300,
      height: 50,
      color: "black",
    },
    inputHalf: {
      paddingHorizontal: 10,
      backgroundColor: theme.colors.secondaryContainer,
      width: 140,
      height: 50,
      color: "black",

    },
    button: {
      width: 250,
      paddingVertical: 10,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 15,
    },
    buttonText: {
      color: "white",
      fontSize: 18,
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
    nameContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    errorText: {
      fontSize: 10,
      color: "red",
      alignSelf: "flex-start",
      marginLeft: 25,
    },
  });

  return (
    <ScrollView style={{flexGrow: 1, backgroundColor: 'white'}}>
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text variant="bodyLarge" style={styles.title}>Hello,</Text>
        <Text variant="displaySmall" style={styles.subTitle}>Sign Up</Text>
      </View>
      <View style={styles.loginContainer}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <View style={styles.nameContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputHalf}
                placeholder="First Name"
                placeholderTextColor={"gray"}
                onChangeText={(text) => setFirstName(text)}
                value={firstName}
              />
            </View>


            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputHalf}
                placeholder="Last Name"
                placeholderTextColor={"gray"}
                onChangeText={(text) => setLastName(text)}
                value={lastName}
              />
            </View>


          </View>

          <View style={{ flexDirection: "row" }}>
            <View style={{ flexDirection: "column", width: "50%" }}>
              {
                errors.firstName ? (<Text style={styles.errorText}>{errors.firstName}</Text>) : null
              }
            </View>
            <View style={{ flexDirection: "column", width: "50%" }}>

              {
                errors.lastName ? (<Text style={styles.errorText}>{errors.lastName}</Text>) : null
              }
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            {
              errors.firstNameBlank ? (
                <Text style={styles.errorText}>{errors.firstNameBlank}</Text>) : null
            }
            {
              errors.lastNameBlank ? (
                <Text style={styles.errorText}>{errors.lastNameBlank}</Text>) : null
            }
          </View>


          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={"gray"}
              onChangeText={(text) => setEmail(text)}
              value={email}
              autoCapitalize="none"
            />
          </View>
          {
            errors.email ? (<Text style={styles.errorText}>{errors.email}</Text>) : null
          }
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor={"gray"}
              onChangeText={handleUsername}
              value={username}
            />
          </View>
          {
            errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null
          }
          <View style={{ ...styles.inputContainer, flexDirection: "row" }}>
            <TextInput
              style={{ ...styles.input, marginBottom: 0 }}
              placeholder="Password"
              placeholderTextColor={"gray"}
              secureTextEntry={!isPasswordVisible}
              onChangeText={handlePassword}

              value={password}
              autoCapitalize="none"
            />

            <IconButton icon={isPasswordVisible ? "eye" : "eye-off"} onPress={togglePasswordVisibility}
                        style={{ position: "absolute", right: 0 }} />
          </View>
          {
            errors.password ? (<Text style={styles.errorText}>{errors.password}</Text>) : null
          }
          {
            errors.passwordStrength ? (
              <Text style={styles.errorText}>{errors.passwordStrength}</Text>) : null
          }
          <View style={{ ...styles.inputContainer, flexDirection: "row" }}>
            <TextInput
              style={{ ...styles.input, paddingRight: 50 }}
              placeholder="Confirm Password"
              placeholderTextColor={"gray"}
              secureTextEntry={!isPasswordConfirmVisible}
              onChangeText={handleConfirmPassword}
              value={confirmPassword}
              autoCapitalize="none"
            />

            <IconButton icon={isPasswordConfirmVisible ? "eye" : "eye-off"} onPress={toggleConfirmPasswordVisibility}
                        style={{ position: "absolute", right: 0 }} />
          </View>
          {
            errors.confirmPassword ?
              <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null
          }

          <Button mode="contained"
                  style={{ width: 300, marginTop: 10 }}
                  onPress={handleSubmit}>
            Sign up
          </Button>
        </View>
      </View>
    </View>
    </ScrollView>
  );
};


export default CreateAccount;

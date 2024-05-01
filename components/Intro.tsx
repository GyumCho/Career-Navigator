import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { StackScreenProps } from "@react-navigation/stack";
import { AuthStackProps } from "../util/nav.ts";


const Intro: React.FC<StackScreenProps<AuthStackProps, 'Intro'>> = ({ navigation }) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.primaryContainer,
    },
    subTitle: {
      textAlign: "left",
      marginHorizontal: 10,
    },
  });

  return (
    <View style={styles.container}>
      <View style={{ height: 400, alignItems: 'center', justifyContent: 'center' }}>
        <Image
          source={require('../img/CareerNavigatorLogo.png')} // Provide the path to your image file
          style={{ width: 250, height: 300 }}
        />
      </View>
      <View style={{
        backgroundColor: "white",
        height: 100,
        flex: 1,
        paddingTop: 20,
        paddingLeft: 20,
        justifyContent: "flex-end",
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
      }}>
        <Text style={{ fontWeight: "bold", marginHorizontal: 10 }} variant="displaySmall">Welcome to</Text>
        <Text style={{ fontWeight: "bold", marginHorizontal: 10, color: theme.colors.primary }}
              variant="displaySmall">CareerNavigator</Text>
        <Text variant="bodyLarge" style={styles.subTitle}>Stressed about your career? {"\n"} Fear no more, you are at
          the right place! </Text>
        <Button mode="contained" style={{ margin: 10, marginTop: 50 }} onPress={() => {
          navigation.navigate("Login", {});
        }}>Sign in</Button>
        <Button mode="outlined" style={{ marginTop: 0, marginHorizontal: 10, marginBottom: 20 }} onPress={() => {
          navigation.navigate("CreateAccount", {});
        }}>Sign up</Button>
      </View>
    </View>
  );
};

export default Intro;

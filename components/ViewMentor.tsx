import React, { useEffect, useState } from "react";
import { View, StyleSheet, Linking } from "react-native";
import { Card, useTheme, Text, Button } from "react-native-paper";
import { Userpic } from "react-native-userpic";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { MainDrawerProps } from "../util/nav.ts";
import { AccountService, UserSchema } from "../api";
import { doApiRequest } from "../util/api.tsx";


const handleEmail = (email: string) => () => {
  console.log(`Emailing ${email}`);
  Linking.openURL(`mailto:${email}`);
};

const ViewMentor: React.FC<DrawerScreenProps<MainDrawerProps, 'ViewMentor'>> = () => {
  const theme = useTheme();
  const [mentorData, setMentorData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    username: '',
  });

  useEffect(() => {
    doApiRequest(AccountService.getMontor)
      // @ts-ignore
      .then((res: UserSchema) => {
        if (res !== null) {
          const m = {email: res.email, firstName: res.first_name, lastName: res.last_name, username: res.username};
          // @ts-ignore
          setMentorData(m);
          console.log(mentorData);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white",
      padding: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    card: {
      backgroundColor: theme.colors.primaryContainer,
      elevation: 4,
      borderRadius: 10,
    },
    cardContent: {
      fontSize: 16,
      marginBottom: 5,
    },
    cardLabel: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 5,
      marginTop: 5,
    },
    userpic: {
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      margin: 25,
    },
  });

  {
    if (mentorData.email === "" && mentorData.firstName === "" && mentorData.lastName === "" && mentorData.username === "") {
      return (
        <View style={styles.container}>
          <Text variant={"displaySmall"} style={{color: theme.colors.error, margin: 20, alignSelf: 'center', textAlign:'center'}}>You have not been accepted by a mentor yet</Text>
          <Text variant={"headlineMedium"} style={{color: theme.colors.error, margin: 20, alignSelf: 'center', textAlign:'center'}}>Please wait for a mentor to accept your request</Text>
        </View>
      );
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.userpic}><Userpic size={125} email={mentorData.email} /></View>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={{fontWeight: 'bold', fontSize: 24}} variant={'titleLarge'}>Name</Text>
          <Text variant={'bodyLarge'} style={{fontSize: 20}}>{mentorData.firstName} {mentorData.lastName}</Text>
          <Text style={{fontWeight: 'bold', fontSize: 20, marginTop: 10}} variant={'titleLarge'}>Username</Text>
          <Text variant={'bodyLarge'} style={{fontSize: 16}}>{mentorData.username}</Text>
          <Text variant={"labelLarge"} style={{fontWeight: 'bold', fontSize: 20, marginTop: 10}}>Email</Text>
          <Button mode={'outlined'} style={{padding: 2, marginTop: 5}} icon={'email'} onPress={handleEmail(mentorData.email)}><Text style={styles.cardContent}>{mentorData.email}</Text></Button>
        </Card.Content>
      </Card>
    </View>
  );
};

export default ViewMentor;

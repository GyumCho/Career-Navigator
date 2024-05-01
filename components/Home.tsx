import React from 'react';

import { MainDrawerProps } from "../util/nav";
import { StyleSheet, View } from "react-native";
import { Icon, Text, TouchableRipple, useTheme, ActivityIndicator } from "react-native-paper";
import { AccountService } from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useApi } from "../util/api";
import { useEffect } from "react";
import { useAuthState } from "../context/authcontext";
import { Userpic } from "react-native-userpic";
import { DrawerScreenProps } from "@react-navigation/drawer";


const Home: React.FC<DrawerScreenProps<MainDrawerProps, 'Home'>> = ({ navigation }) => {
  const theme = useTheme();
  const { isMentor } = useAuthState();
  const [userInfoResponse, getUserInfo] =
    useApi(AccountService.accountProfile);

  const styles = StyleSheet.create({
    button: {backgroundColor: theme.colors.primaryContainer,
      width: '100%',
      flex: 1,
      borderRadius: 30,
      padding: 20,
      marginTop: 20,
      marginHorizontal: 20,
    },
  });


  useEffect(() => {
    (async () => {
      let username = await AsyncStorage.getItem('username');
      if (username) {
        await getUserInfo(username);
      }
    })().catch(console.error);
  }, [getUserInfo]);

  if (userInfoResponse.state === "initial" || userInfoResponse.state === "fetching") {
    return (
      <View style={{flex: 1, backgroundColor: "white"}}>
        <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator animating color={theme.colors.onPrimaryContainer} size={100}/>
        </View>
      </View>
    );
  } else if (userInfoResponse.state === "success") {
    const userInfo = userInfoResponse.response;
    const message = `${userInfo.first_name} ${userInfo.last_name}`;
    return (
      <View style={{flex: 1, backgroundColor: theme.colors.primary}}>
        <View style={{padding: 20}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Userpic size={60} email={userInfo.email} />
          <View style={{flexDirection: 'column', marginLeft: 15}}>
            <Text variant="headlineSmall" style={{fontWeight: 'bold', color: 'white'}}>Welcome</Text>
            <Text variant="headlineMedium" style={{color:'white', fontWeight: 'bold'}}>{message}</Text>
          </View>
        </View>
        </View>
        {
          !isMentor ? (
            <View style={{flex: 1,
              borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            backgroundColor: 'white'}}>
              <View style={{padding: 20, flexDirection: 'column', alignItems: 'center', flex: 1}}>
                <TouchableRipple onPress={() => navigation.navigate("Resume", {})} style={styles.button} borderless>
                  <View style={{flex: 1,flexDirection: 'row'}}>
                    <View>
                      <Text variant="headlineSmall" style={{fontWeight: 'bold', color:theme.colors.onPrimaryContainer}}>Your Resume</Text>
                      <Text variant="bodyLarge" style={{fontWeight: 'bold', color:theme.colors.onPrimaryContainer}}>Create or Upload your Resume</Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center'}}>
                      <Icon source="file-account" size={50} color={theme.colors.onPrimaryContainer} />
                    </View>
                  </View>
                </TouchableRipple>
                <TouchableRipple onPress={() => navigation.navigate("JobList", {})} style={styles.button} borderless>
                  <View style={{flex: 1,flexDirection: 'row'}}>
                    <View>
                      <Text variant="headlineSmall" style={{fontWeight: 'bold', color:theme.colors.onPrimaryContainer}}>Jobs</Text>
                      <Text variant="bodyLarge" style={{fontWeight: 'bold', color:theme.colors.onPrimaryContainer}}>View Job Vacancies</Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center'}}>
                      <Icon source="archive-search-outline" size={50} color={theme.colors.onPrimaryContainer} />
                    </View>
                  </View>
                </TouchableRipple>
                <TouchableRipple onPress={() => navigation.navigate("PostTips", {})} style={styles.button} borderless>
                  <View style={{flex: 1,flexDirection: 'row'}}>
                    <View>
                        <Text variant="headlineSmall" style={{fontWeight: 'bold', color:theme.colors.onPrimaryContainer}}>Tips</Text>
                        <Text variant="bodyLarge" style={{fontWeight: 'bold', color:theme.colors.onPrimaryContainer}}>View Important Tips and Tricks</Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center'}}>
                      <Icon source="lightbulb-on" size={50} color={theme.colors.onPrimaryContainer} />
                    </View>
                </View>
                </TouchableRipple>
                <TouchableRipple onPress={() => navigation.navigate("Forum", {})} style={styles.button} borderless>
                  <View style={{flex: 1,flexDirection: 'row'}}>
                    <View>
                      <Text variant="headlineSmall" style={{fontWeight: 'bold', color:theme.colors.onPrimaryContainer}}>Forum</Text>
                      <Text variant="bodyLarge" style={{fontWeight: 'bold', color:theme.colors.onPrimaryContainer}}>View Forum</Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center'}}>
                      <Icon source="forum" size={50} color={theme.colors.onPrimaryContainer} />
                    </View>
                  </View>
                </TouchableRipple>
                <Text style={{marginLeft: 20, marginTop:20, fontWeight: 'bold', width:'100%'}} variant="bodyLarge">View all options in the side menu (☰)</Text>
              </View>


            </View>
          ) : (
            <View style={{flex: 1, borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              backgroundColor: 'white'}}>
              <View style={{padding: 20, flexDirection: 'column', alignItems: 'center', flex: 1}}>
                <TouchableRipple onPress={() => navigation.navigate("MentorStudents", {})} style={styles.button} borderless>
                    <View style={{flex: 1,flexDirection: 'row'}}>
                      <View>
                          <Text variant="headlineSmall" style={{fontWeight: 'bold', color:theme.colors.onPrimaryContainer}}>Students</Text>
                          <Text variant="bodyLarge" style={{fontWeight: 'bold', color:theme.colors.onPrimaryContainer}}>View your students</Text>
                      </View>
                      <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center'}}>
                        <Icon source="account-group" size={50} color={theme.colors.onPrimaryContainer} />
                      </View>
                    </View>
                </TouchableRipple>
                <TouchableRipple onPress={() => navigation.navigate("MentorMatching", {})} style={styles.button} borderless>

                <View style={{flex: 1,flexDirection: 'row'}}>
                      <View>
                          <Text variant="headlineSmall" style={{fontWeight: 'bold', color:theme.colors.onPrimaryContainer}}>Accept Students</Text>
                          <Text variant="bodyLarge" style={{fontWeight: 'bold', color:theme.colors.onPrimaryContainer}}>View Students looking for Mentor</Text>
                      </View>
                      <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center'}}>
                        <Icon source="account-supervisor-outline" size={50} color={theme.colors.onPrimaryContainer} />
                      </View>
                    </View>
                </TouchableRipple>

                <TouchableRipple onPress={() => navigation.navigate("Forum", {})} style={styles.button} borderless>
                <View style={{flex: 1,flexDirection: 'row'}}>
                      <View>
                          <Text variant="headlineSmall" style={{fontWeight: 'bold', color:theme.colors.onPrimaryContainer}}>Forum</Text>
                          <Text variant="bodyLarge" style={{fontWeight: 'bold', color:theme.colors.onPrimaryContainer}}>View Forum</Text>
                      </View>
                      <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center'}}>
                        <Icon source="forum" size={50} color={theme.colors.onPrimaryContainer} />
                      </View>
                    </View>
                </TouchableRipple>
                <TouchableRipple onPress={() => navigation.navigate("JobPosting", {})} style={styles.button} borderless>
                <View style={{flex: 1,flexDirection: 'row'}}>
                      <View>
                          <Text variant="headlineSmall" style={{fontWeight: 'bold', color:theme.colors.onPrimaryContainer}}>Post Job</Text>
                          <Text variant="bodyLarge" style={{fontWeight: 'bold', color:theme.colors.onPrimaryContainer}}>Post a new job</Text>
                      </View>
                      <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center'}}>
                        <Icon source="pencil-plus" size={50} color={theme.colors.onPrimaryContainer} />
                      </View>
                    </View>
                </TouchableRipple>
              <Text style={{marginLeft: 20, marginTop:20, width:'100%', fontWeight: 'bold'}} variant="bodyLarge">View all options in the side menu (☰)</Text>
              </View>
            </View>
          )
        }
      </View>
    );
  }
};

export default Home;

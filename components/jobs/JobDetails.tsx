import React, { useEffect, useState } from "react";
import { Alert, BackHandler, Image, Linking, StyleSheet, View } from "react-native";
import { Text, Button, TouchableRipple, useTheme } from "react-native-paper";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { MainDrawerProps } from "../../util/nav.ts";
import { ScrollView } from "react-native-gesture-handler";
import { AccountService, ApplicationService } from "../../api/index.ts";
import { doApiRequest } from "../../util/api.tsx";

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    flexDirection: "column",
    flexGrow: 1,
    justifyContent: "space-between",
  },
  header: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center",

  },
  title: {
    fontSize: 26,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
  },
  description: {
    backgroundColor: "white",
    padding: 20,
    flexGrow: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  descriptionBody: {
    flex:1,
    margin: 10,
  },
  buttonline: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    backgroundColor: "white",
    height: 80,
    width: 80,
    borderRadius: 6,
    paddingBottom: 20,
  },
  footer: {
    flex: 0,
    backgroundColor: "white",
    padding: 20,
  },
});


const JobDetails: React.FC<DrawerScreenProps<MainDrawerProps, 'JobDetails'>> = ({ route, navigation }) => {
  const { job } = route.params;
  const [tab, setTab] = useState('0');
  const [mentor, setMentor] = useState(null);
  const validator = require("email-validator");

  const handleSubmit = async () => {
    try {
      await doApiRequest(ApplicationService.createApplication, {job_id: job.id || 0});
      Alert.alert(
        "Application Submitted",
        "Your application has been submitted successfully.",
        [
          {
            text: "OK",
            onPress: () => {
              //@ts-ignore
              navigation.navigate("JobList");
            }
          }
        ]
      );
    } catch (error: any) {
      if (error.message === "Internal Server Error") {
        Alert.alert("You have already applied to this job!");
      }
    }
  };

  useEffect(() => {
    const backAction = () => {
      //@ts-ignore
      navigation.navigate('JobList');
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [navigation]);


  useEffect(() => {
    getMentor();
  }, []);

  const getMentor = async () => {
    const mentor = await doApiRequest(AccountService.getMontor);
    // @ts-ignore
    setMentor(mentor);
    console.log(mentor);
  }

  const checkValid = () => {
    return mentor !== null;
  }

  const theme = useTheme();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.logo}
          source={{
            uri: job.image,
          }}
        />
        <Text style={styles.title}>{job.title}</Text>
        <Text>{job.company.name} / {job.location}</Text>
      </View>
      <View style={styles.description}>
        <View style={styles.buttonline}>
          <Button style={{ marginRight: 10 }} mode={tab === '0' ? "contained" : "outlined"} onPress={() =>setTab('0')}>Description</Button>
          <Button mode={tab === '1' ? "contained" : "outlined"} onPress={() => setTab('1')}>Company</Button>
        </View>
        <View style={styles.descriptionBody}>
          { tab === '0' ?
            (
              <ScrollView>
                <Text style={styles.subtitle}>Job Description</Text>
                <Text>{job.description}</Text>
                <Text style={{... styles.subtitle, marginTop: 10}}>Application Instructions</Text>
                <Text>Apply before {job.deadline}</Text>
                <Text>{job.instructions}</Text>
                <Text style={{... styles.subtitle, marginTop: 10}}>Requirements</Text>
                <Text>{job.instructions}</Text>
                <Text style={{... styles.subtitle, marginTop: 10}}>Salary</Text>
                <Text>{job.salary}</Text>
                <Text style={{... styles.subtitle, marginTop: 10}}>Contact</Text>
                {
                  validator.validate(job.contact_info) ? (
                    <TouchableRipple onPress={() => Linking.openURL(`mailto:${job.contact_info}`)}>
                      <View style={{borderWidth: 1,
                        borderColor: 'black',
                        padding: 5,
                        borderRadius: 20,}}>
                        <Text>{job.contact_info}</Text>
                      </View>
                    </TouchableRipple>
                  ) : (
                    <Text>Email: {job.contact_info}</Text>
                  )
                }
                <Text style={{... styles.subtitle, marginTop: 10}}>Additional Information</Text>
                <Text>{job.additional}</Text>
              </ScrollView>
            ) : (
              <ScrollView>
                <Text style={styles.subtitle}>{job.company.name}</Text>
                <Text>{job.company.description}</Text>
              </ScrollView>
            )
          }
        </View>
      </View>
      <View style={styles.footer}>
        <Button mode="contained" onPress={handleSubmit} disabled={!checkValid()}>
          Apply Now</Button>
        {
          !checkValid() && (
            <Text style={{marginTop: 10, color: theme.colors.error, alignSelf: 'center'}}>You cannot apply for a job until a mentor accepts you. Please wait</Text>
          )
        }
      </View>
    </View>
  );
};

export default JobDetails;

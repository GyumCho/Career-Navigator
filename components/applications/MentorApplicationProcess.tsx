import React, { useEffect, useState } from "react";
import {ScrollView, StyleSheet, View} from "react-native";
import { Text, useTheme, TextInput, Button, Avatar, IconButton } from "react-native-paper";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { ApplicationService, Job, JobApplicationSchema } from "../../api";
import { doApiRequest } from "../../util/api.tsx";
import { Userpic } from "react-native-userpic";

interface MentorApplicationProcessProps {
  user: any
  closeModal: () => void;
}

const MentorApplicationProcess: React.FC<MentorApplicationProcessProps> = ({ user, closeModal }) => {
  const theme = useTheme();
  const [applicationBool, setApplicationBool] = useState(false);
  const [currentJobIndex, setCurrentJobIndex] = useState<number | null>(null);
  const [text, setText] = useState("");
  const [jobs, setJobs] = useState<{[key: string]: JobApplicationSchema}>({});
  const [process_dict, setProcessDict] = useState<any>({});

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      backgroundColor: theme.colors.background,
      alignItems: 'center',
      flexGrow: 1,
    },
    top_bar : {
      backgroundColor : 'white',
      width : '100%',
      height : '5%',
      flexDirection : 'row',
      alignItems : 'center',
      marginTop : 10,
      elevation : 10,
    },
    userIcon_container : {
      width : '100%',
      backgroundColor : 'white',
      alignItems : 'center',
      marginTop : 10,
      elevation : 10,
    },
    userName_text : {
      marginBottom : 10,
    },
    applicationTab_container : {
      width : '100%',
      marginTop : 10,
      elevation : 10,
      backgroundColor : 'white',
      flex: 1
    },
    userApplication_button :{
      width : '100%',
      height : 60,
      borderRadius : 0,
      marginTop : 20,
      elevation : 10,
    },
    jobDescription_container : {
      width : '100%',
      backgroundColor : 'white',
      marginTop : 20,
      elevation : 10,
    },
    jobDescription_text : {
      fontWeight : 'bold',
      marginLeft : 30,
      marginTop : 5,
      marginBottom : 5,
    },
    state_container : {
      backgroundColor : 'white',
      width : '100%',
      marginTop : 20,
      elevation : 10,
      alignItems: 'flex-start',
      paddingLeft: 20,
    },
    state_checkBox : {
      marginBottom : 10,
    },
    text_input_container :{
      marginTop : '0.1%',
      width : '95%',
      marginBottom : '4%',
    },
    submission_button : {
      marginTop : 10,
      borderRadius : 0,
      width: '95%',
    },
  });

  const getApplications = async () => {
    const res = await doApiRequest(ApplicationService.getApplications, user.username);
    res.forEach((job, index) => {
      setJobs((prevJobs: any) => {
        return {
          ...prevJobs,
          [index]: job,
        };
      })
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      await getApplications();
    };
    fetchData().catch((error) => {});
  }, []);

  useEffect(() => {
    generateProcessDict(jobs);
  }, [jobs]);

  function generateProcessDict(jobs: any) {
    const jobsData: [string, JobApplicationSchema][] = Object.entries(jobs);
    const process_dict = {};

    {jobsData.forEach((job, index) => {
      // @ts-ignore
      process_dict[index] = [['Send Resume', 'Resume Processed', 'Test', 'Interview'], [false, false, false, false]];
    });

    setProcessDict(process_dict); // Assuming setProcessDict is defined and accessible in your component
  }}

  const handleJobSelection = (index: number) => {
    setCurrentJobIndex(index);
    setApplicationBool(true);
  };

  const handleSubmit = async (index: number) => {
    const feedback = {
      sent: process_dict[index][1][0],
      processed: process_dict[index][1][1],
      interviewed: process_dict[index][1][2],
      tested: process_dict[index][1][3],
      feedback: text
    }
    console.log(feedback);
    const jobid = (jobs[index].id) || 0;
    // get the job id from the jobs object
    await doApiRequest(ApplicationService.setFeedback, jobid, feedback);
  }

  useEffect(() => {
    console.log(process_dict);
  }, [process_dict]);

  const handleClose = () => {
    setProcessDict({});
    setJobs({});
    closeModal();
  }
  return (
    <View style={styles.container}>
      {!applicationBool ? (
        <>
          <View style={styles.userIcon_container}>
            <Userpic size={100} email={user.email}/>
            <IconButton icon="refresh" size={30} onPress={getApplications} style={{position: 'absolute', right: 10, top: 10}}/>
            <Text variant="displaySmall" style={styles.userName_text}>{user.username}</Text>
            <Text variant="headlineSmall" style={styles.userName_text}>{user.email}</Text>
          </View>
          <ScrollView style={styles.applicationTab_container}>
            {Object.entries(jobs).map(([index, job]) => (
              <Button
                key={index}
                mode="contained"
                uppercase={true}
                onPress={() => handleJobSelection(Number(index))}
                style={styles.userApplication_button}
                labelStyle={{ fontSize: 15, paddingTop: 10 }}
              >
                {/* @ts-ignore */}
                {`${job.job.title} | ${job.job.company.name}`}
              </Button>
            ))}
            <Button
              mode="outlined"
              onPress={handleClose}
              style={styles.userApplication_button}
              labelStyle={{ fontSize: 20, paddingTop: 10 }}
            >
              Close
            </Button>
          </ScrollView>
        </>
      ) : currentJobIndex !== null && (
        <ScrollView style={{ width: '100%' }} contentContainerStyle={{ alignItems: 'center', paddingBottom: 60 }}>
          <View style={styles.jobDescription_container}>
            {
              jobs[currentJobIndex] && (
                <View style={{flexDirection: 'column'}}>
                  <Text variant="headlineSmall" style={styles.jobDescription_text}>{jobs[currentJobIndex].job.title}</Text>
                  <Text variant="bodyLarge" style={{marginLeft: 30, marginBottom: 10}}>{jobs[currentJobIndex].job.company.name}</Text>
                </View>
              )
            }
          </View>

          <View style={styles.state_container}>
            <Text variant="headlineSmall" style={{fontWeight: 'bold', marginTop: 10, marginBottom: 10}}>Application Steps</Text>
            {process_dict[currentJobIndex][0].map((step: string, index: number) => (
              <BouncyCheckbox
                key={index}
                fillColor="rgb(120, 69, 172)"
                text={step}
                isChecked={process_dict[currentJobIndex][1][index]}
                onPress={() => {
                  const updatedProcessDict = {
                    ...process_dict, // Spread the properties of the existing process_dict
                    [currentJobIndex]: [ // Update the specific property for the current job index
                      [...process_dict[currentJobIndex][0]], // steps
                      [...process_dict[currentJobIndex][1]] // boolean values
                    ]
                  };
                  updatedProcessDict[currentJobIndex][1][index] = !updatedProcessDict[currentJobIndex][1][index]; // Update the boolean value
                  setProcessDict(updatedProcessDict); // Set the updated process_dict
                }}
                style={styles.state_checkBox}
                textStyle={{fontWeight: 'bold'}}
              />
            ))}

            <TextInput
              label="Feedback (optional)"
              value={text}
              onChangeText={setText}
              mode={'outlined'}
              numberOfLines={10}
              multiline={true}
              style={styles.text_input_container}
            />
          </View>
          <Button mode="contained" style={styles.submission_button} onPress={() => handleSubmit(currentJobIndex)}>Submit changes</Button>
          <Button
            mode="outlined"
            onPress={() => {
              setApplicationBool(false);
              setCurrentJobIndex(null);
            }}
            style={styles.submission_button}
          >
            Go Back
          </Button>
        </ScrollView>
      )}
    </View>
  );
};

export default MentorApplicationProcess;

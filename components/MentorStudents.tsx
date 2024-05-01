import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, Linking, Modal } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Card, IconButton, Searchbar, useTheme, Button } from "react-native-paper";
import { MainDrawerProps } from "../util/nav.ts";
import { DrawerScreenProps } from "@react-navigation/drawer";
import MentorApplicationProcess from "./applications/MentorApplicationProcess.tsx";
import { AccountService, ApplicationService } from "../api";
import { doApiRequest } from "../util/api.tsx";
import RNFS from "react-native-fs";
import AsyncStorage from "@react-native-async-storage/async-storage";


interface Student {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

const MentorStudents: React.FC<DrawerScreenProps<MainDrawerProps, "MentorStudents">> = ({ navigation, route }) => {
  const theme = useTheme();

  const [students, setStudents] = useState<Student[]>([] as Student[]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student>();

  const loadStudents = async () => {
    try {
      const response = await doApiRequest(AccountService.getMentees);
      const newStudents = response.map(student => ({
        username: student.username,
        email: student.email || "",
        firstName: student.first_name || "",
        lastName: student.last_name || "",
      }));
      setStudents([...newStudents]);
    } catch (error) {
      console.error("Error loading students", error);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);


  const openEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const openModal = (student: Student) => {
    modalVisible ? setModalVisible(false) : setModalVisible(true);
    setSelectedStudent(student);
  };

  const handleSearch =  (query: string) => {
    setSearchQuery(query);
  };

  const downloadResume = async(username: string) => {
    try {
      let pdfBase64 = await doApiRequest(AccountService.generatePdf, username || "");
      const extension = ".pdf";
      let index = 0;

      if (await RNFS.exists(RNFS.DownloadDirectoryPath + `/Student-${username}-Resume.pdf`)) {
        index++;
      }

      while (await RNFS.exists(RNFS.DownloadDirectoryPath + `/Student-${username}-Resume (${index})${extension}`)) {
        index++;
      }

      const fileName = index === 0 ? `/Student-${username}-Resume.pdf` : `Student-${username}-Resume (${index})${extension}`;

      await RNFS.writeFile(RNFS.DownloadDirectoryPath + `/${fileName}`, pdfBase64, 'base64');
      Alert.alert("Resume Downloaded", "The resume has been downloaded to your Downloads folder.");
    } catch (error) {
      Alert.alert("Error", "Did you finalise or upload your resume yet?");
      console.error("Error creating resume", error);
    }
  };

  const filteredStudents = students.filter((request) =>
    request.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${request.firstName} ${request.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const styles = StyleSheet.create({
    card: {
      margin: 10,
      padding: 10,
      backgroundColor: theme.colors.primaryContainer,
    },
    container: {
      flex: 1,
      backgroundColor: "white",
    },
    cardContent: {
      color: theme.colors.onPrimaryContainer,
      marginTop: 10,
    },
    cardTitle: {
      color: theme.colors.onPrimaryContainer,
      fontSize: 18,
    },
    cardSubitle: {
      color: theme.colors.onPrimaryContainer,
      fontSize: 14,
    },
  });

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Searchbar
            placeholder="Search"
            placeholderTextColor="gray"
            onChangeText={handleSearch}
            value={searchQuery}
            style={{ marginLeft: 5 }}
          />
        </View>
        <IconButton icon="refresh" onPress={loadStudents} />
      </View>
      {filteredStudents.map((student, index) => {
        return (
          <Card key={index} style={styles.card}>
            <Card.Title title={student.firstName + " " + student.lastName} subtitle={student.username}
                        titleStyle={styles.cardTitle} subtitleStyle={styles.cardSubitle} />
            <Card.Content>
              <Text style={styles.cardContent}>{student.email}</Text>
              <View style={{ flexDirection: "row" }}>
                <Button icon="download" mode="contained" buttonColor={theme.colors.primary} style={{ margin: 10}}
                        onPress={() => downloadResume(student.username)}>
                  <Text style={{...styles.cardContent, color:theme.colors.onPrimary}}>Download their resume</Text>
                </Button>
              </View>
            </Card.Content>

            <Card.Actions>
              <Button onPress={() => openEmail(student.email)} icon={"email"} mode="outlined">Email</Button>
              <Button onPress={() => openModal(student)} icon={"application"} mode="outlined">Ongoing Applications</Button>
            </Card.Actions>
          </Card>
        );
      })}
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={closeModal}
      >
        {selectedStudent ? (
          <MentorApplicationProcess
            user = {selectedStudent}
            closeModal={closeModal}
          />
        ) : null}
      </Modal>

    </ScrollView>

  );
};

export default MentorStudents;

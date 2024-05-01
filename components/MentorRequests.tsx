import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, Linking } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Card, IconButton, Searchbar, useTheme, Button } from "react-native-paper";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { MainDrawerProps } from "../util/nav.ts";
import { AccountService } from "../api";
import { doApiRequest } from "../util/api.tsx";
import RNFS from "react-native-fs";

interface Request { // Define the structure of the request object, add/remove fields as needed
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

const MentorRequests: React.FC<DrawerScreenProps<MainDrawerProps, 'MentorMatching'>> = () => {
  const theme = useTheme();
  const [requests, setRequests] = useState<Request[]>([] as Request[]);
  const [searchQuery, setSearchQuery] = useState("");
  const [rejectedRequests, setRejectedRequests] = useState<Request[]>([]);
  const [showRejected, setShowRejected] = useState(false);

  const loadStudents = async () => {
    const response = await doApiRequest( AccountService.nomemtor);
    const newStudents = response.map(student => ({
      username: student.username,
      email: student.email || "",
      firstName: student.first_name || "",
      lastName: student.last_name || "",
    }));
    setRequests([...newStudents]);
  };

  useEffect(() => {
    loadStudents();
    setRejectedRequests([]);
  }, []);

  const toggleRejectedTab = () => {
    setShowRejected(!showRejected);
  };

  const acceptRequest = (username: any) => {
    doApiRequest(AccountService.accept, username ).then(() => {
      console.log("Request accepted");
      loadStudents(); // Refresh the list of requests immediately
    }).catch((error) => {
      console.error("Error accepting request", error);
    });
  };

  const rejectRequest = (username: any) => {
    const rejectedRequest = requests.find(request => request.username === username);
    if (rejectedRequest) {
      setRejectedRequests(prevRejectedRequests => [...prevRejectedRequests, rejectedRequest]);
      setRequests(prevRequests => prevRequests.filter(request => request.username !== username));
    }
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



  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white",
    },
    title: {
      fontSize: 26,
      textAlign: "center",
      marginTop: 20,
    },
    card: {
      margin: 10,
      backgroundColor: theme.colors.primaryContainer,
    },
    cardContent: {
      marginTop: 10,
      color: theme.colors.onPrimaryContainer
    },
    cardTitle: {
      color: theme.colors.onPrimaryContainer,
      fontSize: 18,
    },
    cardSubitle: {
      color: theme.colors.onPrimaryContainer,
      fontSize: 14,
    },
    rowContainer: {
      flexDirection: "row",
    },
    rejectedTab: {
      backgroundColor: theme.colors.tertiaryContainer,
      margin: 10,
      borderRadius: 5,
      height: 50,
    },
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredRequests = requests.filter((request) =>
    request.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${request.firstName} ${request.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (requests.length === 0) {
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
          <Button onPress={toggleRejectedTab} style={styles.rejectedTab} icon={showRejected ? "chevron-down" : "chevron-right"}>
            <View >
              <Text style={{ color: theme.colors.onTertiaryContainer }}>Rejected</Text>
            </View>
          </Button>
        {showRejected && (
          <View>
            {rejectedRequests.map((request: Request, index: number) => (
              <Card key={index} style={styles.card}>
                <Card.Title
                  title={`${request.firstName} ${request.lastName}`}
                  subtitle={request.username}
                  titleStyle={styles.cardTitle}
                  subtitleStyle={styles.cardContent}
                />
                <Card.Content>
                  <Button onPress={() => Linking.openURL(`mailto:${request.email}`)} mode={'outlined'}><Text style={styles.cardContent}>Email: {request.email}</Text></Button>
                  <View style={styles.rowContainer}>

                    <Button icon="download" mode="contained" buttonColor={theme.colors.primary} style={{ margin: 10}}
                            onPress={() => downloadResume(request.username)}>
                      <Text style={{...styles.cardContent, color:theme.colors.onPrimary}}>Download their resume</Text>
                    </Button>
                  </View>
                </Card.Content>
                <Card.Actions>
                  <IconButton icon="check-circle" iconColor="green" size={25}
                              onPress={() => acceptRequest(request.username)} style={{ borderWidth: 0 }} />
                </Card.Actions>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    );
  }



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

      {filteredRequests.map((request: any, index: number) => {
        return (
          <Card key={index} style={styles.card}>
            <Card.Title title={`${request.firstName} ${request.lastName}`} subtitle={request.username}
                        titleStyle={styles.cardTitle} subtitleStyle={styles.cardSubitle} />
            <Card.Content>
              <Button onPress={() => Linking.openURL(`mailto:${request.email}`)} mode={'outlined'}><Text style={styles.cardContent}>Email: {request.email}</Text></Button>
              <View style={{ flexDirection: "row" }}>

                <Button icon="download" mode="contained" buttonColor={theme.colors.primary} style={{ margin: 10}}
                        onPress={() => downloadResume(request.username)}>
                  <Text style={{...styles.cardContent, color:theme.colors.onPrimary}}>Download their resume</Text>
                </Button>
              </View>
            </Card.Content>
            <Card.Actions>
              <IconButton icon="check-circle" iconColor="green" size={25}
                          onPress={() => acceptRequest(request.username)} style={{ borderWidth: 0 }} />
              <IconButton icon="close-circle" iconColor={theme.colors.error} size={25}
                          onPress={() => rejectRequest(request.username)} style={{ borderWidth: 0 }} />
            </Card.Actions>
          </Card>
        );
      })

      }
      <View>
        <Button onPress={toggleRejectedTab} style={styles.rejectedTab} icon={showRejected ? "chevron-down" : "chevron-right"}>
          <View >
            <Text style={{ color: theme.colors.onTertiaryContainer }}>Rejected</Text>
          </View>
        </Button>
      </View>

      {showRejected && (
        <View>
          {rejectedRequests.map((request: Request, index: number) => (
            <Card key={index} style={styles.card}>
              <Card.Title
                title={`${request.firstName} ${request.lastName}`}
                subtitle={request.username}
                titleStyle={styles.cardTitle}
                subtitleStyle={styles.cardContent}
              />
              <Card.Content>
                <Button onPress={() => Linking.openURL(`mailto:${request.email}`)} mode={'outlined'}><Text style={styles.cardContent}>Email: {request.email}</Text></Button>
                <View style={styles.rowContainer}>
                  <Button icon="download" mode="contained" buttonColor={theme.colors.primary} style={{ margin: 10}}
                          onPress={() => downloadResume(request.username)}>
                    <Text style={{...styles.cardContent, color:theme.colors.onPrimary}}>Download their resume</Text>
                  </Button>

                </View>
              </Card.Content>
              <Card.Actions>
                <IconButton icon="check-circle" iconColor="green" size={25}
                            onPress={() => acceptRequest(request.username)} style={{ borderWidth: 0 }} />
              </Card.Actions>
            </Card>
          ))}
        </View>
      )}
    </ScrollView>);

};


export default MentorRequests;

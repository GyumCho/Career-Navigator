import { DrawerScreenProps } from "@react-navigation/drawer";
import { MainDrawerProps } from "../../util/nav.ts";
import { useTheme, Searchbar, Card, Button, Text, IconButton } from "react-native-paper";
import React, { useEffect, useState } from "react";
import { Modal, ScrollView, StyleSheet, View } from "react-native";
import AP from "./ApplicationProcess.tsx";
import { doApiRequest } from "../../util/api.tsx";
import { ApplicationService } from "../../api";

interface Application {
  position: string;
  organization: string;
  location: string;
  applied_date: string;
  image: string;
  keywords: string;
  sent: boolean,
  processed: boolean,
  interviewed: boolean
  feedback?: string;
}

export const ApplicationProcess: React.FC<DrawerScreenProps<MainDrawerProps, "ApplicationProcess">> = ({ navigation }) => {
  const [applications, setApplications] = useState<Application[]>([] as Application[]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredJobs, setFilteredJobs] = useState<Application[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Application>();

  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: "white",
    },
    card: {
      margin: 10,
      padding: 10,
      backgroundColor: theme.colors.primaryContainer,
    },
    cardActions: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginTop: 10,
    },
    modalContent: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
  });

  const closeModal = () => {
    setModalVisible(false);
  };

  const updateFilteredApplications = (query: string) => {
    const filtered = applications.filter((application) =>
      application.position.toLowerCase().includes(query.toLowerCase()) ||
      application.location.toLowerCase().includes(query.toLowerCase()) ||
      application.organization.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredJobs(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    updateFilteredApplications(query);
  };

  useEffect(() => {
    const fetchData = async () => {
      var apps = await doApiRequest(ApplicationService.listApplications);
      var appsz = await apps.items;
      //console.log(appsz)
      setApplications(appsz)
    };
    fetchData();
    //setApplications(fillerApplications);
  }, [navigation]);


  useEffect(() => {
    updateFilteredApplications(searchQuery);
  }, [searchQuery, applications]);

  const fetchData = async () => {
    var apps = await doApiRequest(ApplicationService.listApplications);
    var appsz = await apps.items;
    //console.log(appsz)
    setApplications(appsz)
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView style={styles.container}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Searchbar
          placeholder="Search"
          placeholderTextColor="gray"
          onChangeText={handleSearch}
          value={searchQuery}
          style={{ flex: 1, marginHorizontal:5 }}
        />
          <IconButton icon="refresh" onPress={fetchData} />
        </View>
        {filteredJobs.map((application, index) => (
          <Card key={index} style={styles.card}>
            <Card.Title title={application.position} subtitle={application.organization} titleVariant={'titleLarge'} subtitleVariant={'titleSmall'}/>
            <Card.Content style={{ marginTop: 10 }}>
              <Text>{application.location}</Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => {
                setModalVisible(true);
                setSelectedJob(application);
              }} mode="outlined">View Details</Button>

            </Card.Actions>
          </Card>
        ))}
      </ScrollView>

      <Modal visible={modalVisible} onDismiss={closeModal} style={styles.modalContent}>
        {
          selectedJob ? <AP
              position={selectedJob.position}
              organization={selectedJob.organization}
              location={selectedJob.location}
              applied_date={selectedJob.applied_date}
              image={selectedJob.image}
              keywords={selectedJob.keywords}
              sent ={selectedJob.sent}
              processed={selectedJob.processed}
              interviewed={selectedJob.interviewed}
              feedback={selectedJob.feedback}
              closeModal={closeModal}
            />
            : null
        }
      </Modal>
    </View>
  );
};

import React, {useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import DocumentPicker from "react-native-document-picker";
import { IconButton, Button } from "react-native-paper";
import AddRemoveModal from "./AddRemoveModal";
import { useTheme } from "react-native-paper";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { MainDrawerProps } from "../util/nav.ts";
import { doApiRequest } from "../util/api.tsx";
import { AccountService } from "../api";
import RNFS from "react-native-fs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Buffer } from "buffer";

const ResumeCreation: React.FC<DrawerScreenProps<MainDrawerProps, 'Resume'>> = ({navigation}) => {


  const theme = useTheme();


  const [education, setEducation] = useState([{ degree: "", institution: "", duration: "" }]);
  const [workExperience, setWorkExperience] = useState([{ company: "", position: "", duration: "" }]);
  const [interests, setInterests] = useState([{ interest: "" }]);
  const [skills, setSkills] = useState([{ skill: "" }]);
  const [contactInfo, setContactInfo] = useState([{ email: "", phone: "", address: "" }]);
  const [others, setOther] = useState([{ other: "" }]);
  const [showModal, setShowModal] = useState(false);
  const [modalCategory, setModalCategory] = useState("");
  const [editingItemIndex, setEditingItemIndex] = useState(-1);

  const openModal = (category: any) => {
    setModalCategory(category);
    setShowModal(true);
  };

  const handleAddItem = (formData: any) => {
    switch (modalCategory) {
      case "Education":
        addEducation(formData);
        break;
      case "Work Experience":
        addWorkExperience(formData);
        break;
      case "Interests":
        addInterest(formData);
        break;
      case "Skills":
        addSkill(formData);
        break;
      case "Contact Information":
        addContactInfo(formData);
        break;
      case "Other":
        addOther(formData);
        break;
      default:
        break;
    }
  };

  const handleEditItem = (formData: any, index: number) => {
    setEditingItemIndex(index);
    switch (modalCategory) {
      case "Education":
        setEducation(prevEducation => {
          return prevEducation.map((item, idx) => (idx === editingItemIndex ? formData : item));
        });
        break;
      case "Work Experience":
        setWorkExperience(prevWorkExperience => {
          return prevWorkExperience.map((item, idx) => (idx === editingItemIndex ? formData : item));
        });
        break;
      case "Interests":
        setInterests(prevInterests => {
          return prevInterests.map((item, idx) => (idx === editingItemIndex ? formData : item));
        });
        break;
      case "Skills":
        setSkills(prevSkills => {
          return prevSkills.map((item, idx) => (idx === editingItemIndex ? formData : item));
        });
        break;
      case "Contact Information":
        setContactInfo(prevContactInfo => {
          return prevContactInfo.map((item, idx) => (idx === editingItemIndex ? formData : item));
        });
        break;
      case "Other":
        setOther(prevOthers => {
          return prevOthers.map((item, idx) => (idx === editingItemIndex ? formData : item));
        });
        break;
      default:
        break;
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const addEducation = (formData: any) => {
    setEducation([...education, {
      degree: formData.degree,
      institution: formData.institution,
      duration: formData.duration,
    }]);
  };

  const addInterest = (formData: any) => {
    setInterests([...interests, {
      interest: formData.interest,
    }]);
  };

  const addWorkExperience = (formData: any) => {
    setWorkExperience([...workExperience, {
      company: formData.company,
      position: formData.position,
      duration: formData.duration,
    }]);
  };

  const addSkill = (formData: any) => {
    setSkills([...skills, {
      skill: formData.skill,
    }]);
  };

  const addContactInfo = (formData: any) => {
    setContactInfo([...contactInfo, {
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
    }]);
  };

  const addOther = (formData: any) => {
    setOther([...others, {
      other: formData.other,
    }]);
  };

  const createResume = async () => {
    if (education.length === 1 && workExperience.length === 1 && interests.length === 1 && skills.length === 1 && contactInfo.length === 1 && others.length === 1) {
      Alert.alert("Error", "Resume cannot be empty.");
      return;
    } else if (contactInfo.length === 1) {
      Alert.alert("Error", "Please fill in your contact information.");
      return;
    }
    let username = await AsyncStorage.getItem("username");
    try {
      await AccountService.accountUpdate(
        interests.slice(1).map(item => item.interest).join("<br />"),
        skills.slice(1).map(item => item.skill).join("<br />"),
        others.slice(1).map(item => item.other).join("<br />"),
        {
          education: education,
          work_experience: workExperience,
          contact: contactInfo,
        }
      );
    } catch (error) {
      console.error("Error saving resume", error);
    }
    try {
      let pdf = await doApiRequest(AccountService.generatePdf, username || "");
      const extension = ".pdf";
      let index = 0;

      if (await RNFS.exists(RNFS.DownloadDirectoryPath + "/CareerNavigatorResume.pdf")) {
        index++;
      }

      while (await RNFS.exists(RNFS.DownloadDirectoryPath + `/CareerNavigatorResume (${index})${extension}`)) {
        index++;
      }

      const fileName = index === 0 ? "CareerNavigatorResume.pdf" : `CareerNavigatorResume (${index})${extension}`;

      await RNFS.writeFile(RNFS.DownloadDirectoryPath + `/${fileName}`, pdf, 'base64');
      Alert.alert(
        "Resume Created",
        "Your resume has been created and saved to your Downloads folder.",
        [
          //@ts-ignore
          { text: "OK", onPress: () => navigation.navigate('Home') }
        ]
      );
    } catch (error) {
      console.error("Error creating resume", error);
    }
  };


  const uploadResume = async () => {
    try {
      const document = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
        allowMultiSelection: false,
      });

      const fileContent = await RNFS.readFile(document[0].uri, 'base64');

      await doApiRequest(AccountService.uploadPdf, {
        content: fileContent,
      });

      console.log('Resume uploaded successfully');
      Alert.alert(
        'Resume uploaded successfully!',
        "The resume has been successfully uploaded to the server!",
        [
          //@ts-ignore
          { text: "OK", onPress: () => navigation.navigate('Home') }
        ]
      );
    } catch (error) {
      console.error('Error uploading resume', error);
      Alert.alert("Error", "An error occurred while uploading the resume. Please try again.");
    }
  };

  const downloadResume = async() => {
    try {
      let username = await AsyncStorage.getItem("username");
      let pdfBase64 = await doApiRequest(AccountService.generatePdf, username || "");
      const extension = ".pdf";
      let index = 0;

      if (await RNFS.exists(RNFS.DownloadDirectoryPath + `/${username}-Resume.pdf`)) {
        index++;
      }

      while (await RNFS.exists(RNFS.DownloadDirectoryPath + `/${username}-Resume (${index})${extension}`)) {
        index++;
      }

      const fileName = index === 0 ? `/${username}-Resume.pdf` : `${username}-Resume (${index})${extension}`;

      await RNFS.writeFile(RNFS.DownloadDirectoryPath + `/${fileName}`, pdfBase64, 'base64');
      Alert.alert("Resume Downloaded", "The resume has been downloaded to your Downloads folder.");
    } catch (error) {
      Alert.alert("Error", "Did you finalise or upload your resume yet?");
      console.error("Error creating resume", error);
    }
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
    },
    title: {
      fontSize: 12,
      fontWeight: "bold",
      color: "white",
      position: "relative",
      alignSelf: "center",
    },
    subHeader: {
      fontSize: 20,
      fontWeight: "bold",
      color: "black",
      top: 15,
      marginLeft: 30,
    },
    edit: {
      marginLeft: 30,
      marginTop: 15,
    },
    uploadButton: {
      padding: 10,
      borderRadius: 10,
      margin: 10,
      color: "white",
      fontSize: 13,
      position: "relative",
      textDecorationLine: "underline",
      alignSelf: "center",
    },
    button: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 10,
      borderRadius: 15,
      alignSelf: "center",
      textAlign: "center",
      margin: 10,
      marginVertical: 20
    },
    buttonText: {
      color: "white",
      fontSize: 17,
      fontWeight: "bold",
    },
    button2: {
      backgroundColor: theme.colors.secondary,
      borderRadius: 5,
      alignSelf: "center",
      textAlign: "center",
    },
    button2Text: {
      color: "white",
      fontSize: 14,
      flex: 1,
      fontWeight: "bold",
    },
  });

  return (
    <ScrollView style={styles.container}>
      {/*<Text style={styles.title}>Create or Upload your Resume here!</Text>*/}
      {/* Upload Resume Button */}
      <Button onPress={() => uploadResume()} style={styles.button2}>
        <Text style={styles.button2Text}>Already have a resume? Click here to upload (PDF)</Text>
      </Button>
      {/* Education Section */}
      <Text style={styles.subHeader}>Edit Education</Text>
      <IconButton icon="file-edit" iconColor={theme.colors.primary} style={styles.edit} onPress={() => openModal("Education")} />

      {/* Interests Section */}
      <Text style={styles.subHeader}>Edit Interests</Text>
      <IconButton icon="file-edit" iconColor={theme.colors.primary} style={styles.edit} onPress={() => openModal("Interests")} />

      {/* Work Experience Section */}
      <Text style={styles.subHeader}>Edit Work Experience</Text>
      <IconButton icon="file-edit" iconColor={theme.colors.primary} style={styles.edit} onPress={() => openModal("Work Experience")} />

      {/* Skills Section */}
      <Text style={styles.subHeader}>Edit Skills</Text>
      <IconButton icon="file-edit" iconColor={theme.colors.primary} style={styles.edit} onPress={() => openModal("Skills")} />

      {/* Contact Information Section */}
      <Text style={styles.subHeader}>Edit Contact Information</Text>
      <IconButton icon="file-edit" iconColor={theme.colors.primary} style={styles.edit}
                  onPress={() => openModal("Contact Information")} />


      <Text style={styles.subHeader}>Edit Other Information</Text>
      <IconButton icon="file-edit" iconColor={theme.colors.primary} style={styles.edit} onPress={() => openModal("Other")} />

      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 10}}>
      <Button onPress={() => createResume()} style={styles.button}>
        <Text style={styles.buttonText}>Finalise Resume</Text>
      </Button><Button onPress={() => downloadResume()} style={styles.button}>
        <Text style={styles.buttonText}>Download Resume</Text>
      </Button>

      </View>


      <AddRemoveModal
        visible={showModal}
        category={modalCategory}
        onClose={closeModal}
        onAddItem={handleAddItem}
        onEditItem={handleEditItem}
        items={modalCategory === "Education" ? education : modalCategory === "Work Experience" ? workExperience : modalCategory === "Interests" ? interests : modalCategory === "Skills" ? skills : modalCategory === "Contact Information" ? contactInfo : others}
      />

    </ScrollView>
  );
};




export default ResumeCreation;

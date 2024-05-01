import React, { useMemo, useState } from "react";
import { Text, StyleSheet, Alert, TouchableOpacity, ScrollView, Modal } from "react-native";
import DocumentPicker from "react-native-document-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { JobCreateSchema, JobService } from "../../api";
import { Button, TextInput, useTheme } from "react-native-paper";
import MultiSelect from "react-native-multiple-select";
import {format } from "date-fns";
import { doApiRequest } from "../../util/api.tsx";

interface MBTIType {
  label: string;
  value: string;
}

interface JobSectorType {
  label: string;
  value: string;
}

const JobPosting = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [requirements, setRequirements] = useState("");
  const [salary, setSalary] = useState("");
  const [instructions, setInstructions] = useState("");

  const [deadline, setDeadline] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [contact, setContact] = useState("");
  const [overview, setOverview] = useState("");
  const [keywords, setKeywords] = useState("");
  const [mbti, setMbti] = useState<MBTIType[]>([]);
  const [hc, setHc] = useState<MBTIType[]>([]);
  const [jobField, setJobField] = useState<JobSectorType[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState("");

  const isFormValid = useMemo(() => {
    let newErrors: { [key: string]: string } = {};

    if (!jobTitle) {
      newErrors = { ...newErrors, jobTitle: "Job title is required" };
    }
    if (!company) {
      newErrors = { ...newErrors, company: "Company name is required" };
    }
    if (!location) {
      newErrors = { ...newErrors, location: "Location is required" };
    }
    if (!responsibilities) {
      newErrors = { ...newErrors, responsibilities: "Responsibilities are required" };
    }
    if (!requirements) {
      newErrors = { ...newErrors, requirements: "Requirements are required" };
    }
    if (!instructions) {
      newErrors = { ...newErrors, instructions: "Instructions are required" };
    }
    if (!deadline) {
      newErrors = { ...newErrors, deadline: "Deadline is required" };
    }
    if (!contact) {
      newErrors = { ...newErrors, contact: "Contact information is required" };
    }
    if (!keywords) {
      newErrors = { ...newErrors, keywords: "Keywords are required" };
    }
    if (mbti.length === 0) {
      newErrors = { ...newErrors, mbti: "MBTI types are required" };
    }
    if (jobField.length === 0) {
      newErrors = { ...newErrors, jobField: "Job fields are required" };
    }
    return Object.keys(newErrors).length === 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobTitle, company, location, responsibilities, requirements, salary, instructions, deadline, contact, overview, keywords, mbti, jobField]);


  const confirmJobPosting = async () => {
    Alert.alert("Job posted");
    let job: JobCreateSchema = {
      title: jobTitle,
      company_name: company,
      company_description: overview,
      location: location,
      image: "https://www.creativefabrica.com/wp-content/uploads/2022/09/03/Briefcase-Icon-Graphics-37659995-1.png",
      description: responsibilities,
      salary: salary,
      instructions: instructions,
      requirements: requirements,
      keywords: keywords,
      contact_info: contact,
      //@ts-ignore
      deadline: format(deadline,'yyyy-MM-dd').toString(),
      mbti: mbti.toString(),
      job_fields: jobField.toString(),
      holland: hc.toString(),
      additional: additionalInfo,
    };
    await doApiRequest(JobService.createJob, job);

    clearForm();
  };

  const mbtiTypes = [
    { label: "ISTJ", value: "ISTJ" },
    { label: "ISFJ", value: "ISFJ" },
    { label: "INFJ", value: "INFJ" },
    { label: "INTJ", value: "INTJ" },
    { label: "ISTP", value: "ISTP" },
    { label: "ISFP", value: "ISFP" },
    { label: "INFP", value: "INFP" },
    { label: "INTP", value: "INTP" },
    { label: "ESTP", value: "ESTP" },
    { label: "ESFP", value: "ESFP" },
    { label: "ENFP", value: "ENFP" },
    { label: "ENTP", value: "ENTP" },
    { label: "ESTJ", value: "ESTJ" },
    { label: "ESFJ", value: "ESFJ" },
    { label: "ENFJ", value: "ENFJ" },
    { label: "ENTJ", value: "ENTJ" },
  ];

  const jobFieldTypes = [
    { label: "Science", value: "Science" },
    { label: "Environment", value: "Environment" },
    { label: "Sale", value: "Sale" },
    { label: "Music", value: "Music" },
    { label: "Engineering", value: "Engineering" },
    { label: "Journalism", value: "Journalism" },
    { label: "History", value: "History" },
    { label: "Social Work", value: "Social Work" },
    { label: "Physics", value: "Physics" },
    { label: "Marketing", value: "Marketing" },
    { label: "Economics", value: "Economics" },
    { label: "Agriculture", value: "Agriculture" },
    { label: "Statistics", value: "Statistics" },
    { label: "Performing Arts", value: "Performing Arts" },
    { label: "Psychology", value: "Psychology" },
    { label: "Education", value: "Education" },
    { label: "Applied Sciences", value: "Applied Sciences" },
    { label: "HR", value: "HR" },
    { label: "Medicine", value: "Medicine" },
    { label: "Accounting", value: "Accounting" },
    { label: "Arts", value: "Arts" },
    { label: "Advertising", value: "Advertising" },
    { label: "Mathematics", value: "Mathematics" },
    { label: "Air Transportation", value: "Air Transportation" },
    { label: "Visual Arts", value: "Visual Arts" },
    { label: "Drama", value: "Drama" },
    { label: "Finance", value: "Finance" },
    { label: "Fitness", value: "Fitness" },
    { label: "Biology", value: "Biology" },
    { label: "Communication", value: "Communication" },
    { label: "Architectural Design", value: "Architectural Design" },
    { label: "Geography", value: "Geography" },
    { label: "Acting", value: "Acting" },
    { label: "Business", value: "Business" },
    { label: "Law", value: "Law" },
    { label: "None", value: "None"}
  ];

  const hollandCodeTypes = [
    { label: "Realistic", value: "Realistic" },
    { label: "Investigative", value: "Investigative" },
    { label: "Artistic", value: "Artistic" },
    { label: "Social", value: "Social" },
    { label: "Enterprising", value: "Enterprising" },
    { label: "Conventional", value: "Conventional" },
  ];

  const clearForm = () => {
    setJobTitle("");
    setCompany("");
    setLocation("");
    setResponsibilities("");
    setRequirements("");
    setSalary("");
    setInstructions("");
    setDeadline(null);
    setContact("");
    setOverview("");
    setAdditionalInfo("");
    setKeywords("");
    setMbti([]);
    setHc([]);
    setJobField([]);
  };

  const uploadPDF = async () => {
    try {
      await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
        allowMultiSelection: false,
      });
      // TODO: Send the file (doc[0].uri to get it) to the backend
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log("User cancelled the upload " + error);
      } else {
        console.error("Error uploading file", error);
      }
    }
  };

  const handleJobTitleChange = (text: string) => {
    setJobTitle(text);
  };

  const handleCompanyChange = (text: string) => {
    setCompany(text);
  };

  const handleLocationChange = (text: string) => {
    setLocation(text);
  };

  const handleResponsibilitiesChange = (text: string) => {
    setResponsibilities(text);
  };

  const handleRequirementsChange = (text: string) => {
    setRequirements(text);
  };

  const handleSalaryChange = (text: string) => {
    setSalary(text);
  };

  const handleInstructionsChange = (text: string) => {
    setInstructions(text);
  };

  const handleContactChange = (text: string) => {
    setContact(text);
  };

  const handleDeadlineChange = (event: any, selectedDate?: Date) => {
    if (event.type === "set") {
      const currentDate = selectedDate || new Date();
      setDeadline(currentDate);
      setShowModal(false);
    } else if (event.type === "dismissed") {
      setShowModal(false);
    }
  };

  const handleOverviewChange = (text: string) => {
    setOverview(text);
  };

  const handleKeywordsChange = (text: string) => {
    setKeywords(text);
  };

  const handleAdditionalInfoChange = (text: string) => {
    setAdditionalInfo(text);
  };


  const theme = useTheme();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white",
    },
    contentContainer: {
      alignItems: "center",
      justifyContent: "center",
    },
    input: {
      width: 300,
      margin: 12,
      borderWidth: 1,
      backgroundColor: theme.colors.primaryContainer,
      color: "black",
      fontSize: 16,
      minHeight: 50,
    },
    uploadBtn: {
      marginTop: 10,
      marginBottom: 10,
      width: 300,
    },
    postBtn: {
      margin: 10,
      width: 300,
    },
    header: {
      fontSize: 16,
      color: "black",
      marginTop: 10,
      marginLeft: 50,
      alignSelf: "flex-start",
      lineHeight: 20,
    },

    star: {
      color: "red",
      textAlignVertical: "top",
      fontSize: 16 * 1.1,
    },
  });

  return (


    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} nestedScrollEnabled>
      <Text style={styles.header}>Job Title <Text style={styles.star}>*</Text></Text>
      <TextInput
        style={styles.input}
        placeholder="Add Job Title"
        placeholderTextColor="gray"
        value={jobTitle}
        onChangeText={handleJobTitleChange}
        multiline={true}
      />
      <Text style={styles.header}>Company Name <Text style={styles.star}>*</Text></Text>

      <TextInput
        style={styles.input}
        placeholder="Add Company"
        placeholderTextColor="gray"
        value={company}
        onChangeText={handleCompanyChange}
        multiline
      />

      <Text style={styles.header}>Job Location <Text style={styles.star}>*</Text></Text>
      <TextInput
        style={styles.input}
        placeholder="Add Job Location"
        placeholderTextColor="gray"
        value={location}
        onChangeText={handleLocationChange}
        multiline
      />

      <Text style={styles.header}>Job Description <Text style={styles.star}>*</Text></Text>

      <TextInput
        style={styles.input}
        placeholder="Add Responsibilities & Expectations"
        placeholderTextColor="gray"
        value={responsibilities}
        onChangeText={handleResponsibilitiesChange}
        multiline
      />

      <Text style={styles.header}>Job Requirements <Text style={styles.star}>*</Text></Text>
      <TextInput
        style={{...styles.input}}
        placeholder="Add Requirements & Qualifications"
        placeholderTextColor="gray"
        value={requirements}
        onChangeText={handleRequirementsChange}
        multiline
      />


      <Text style={styles.header}>Salary & Benefits</Text>
      <TextInput
        style={styles.input}
        placeholder="Add Salary & Benefits"
        placeholderTextColor="gray"
        value={salary}
        onChangeText={handleSalaryChange}
        multiline
      />

      <Text style={styles.header}>Application Instructions <Text style={styles.star}>*</Text></Text>
      <TextInput
        style={styles.input}
        placeholder="Add Application Instructions"
        placeholderTextColor="gray"
        value={instructions}
        onChangeText={handleInstructionsChange}
        multiline
      />


      <Text style={styles.header}>Application Deadline <Text style={styles.star}>*</Text></Text>
      <TouchableOpacity onPress={() => setShowModal(true)}>
        <TextInput
          style={styles.input}
          placeholder="Add Application Deadline"
          placeholderTextColor="gray"
          value={deadline ? deadline.toDateString() : ""}
          editable={false}
          multiline
        />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}>
        <DateTimePicker
          value={deadline || new Date()}
          mode="date"
          display="default"
          onChange={handleDeadlineChange}
        />
      </Modal>

      <Text style={styles.header}>Contact Information <Text style={styles.star}>*</Text></Text>
      <TextInput
        style={styles.input}
        placeholder="Add Contact Information"
        placeholderTextColor="gray"
        value={contact}
        onChangeText={handleContactChange}
        multiline
      />

      <Text style={styles.header}>Company Overview</Text>
      <TextInput
        style={{...styles.input, minHeight: 100}}
        placeholder="Add Company Overview"
        placeholderTextColor="gray"
        value={overview}
        onChangeText={handleOverviewChange}
        multiline
      />

      <Text style={styles.header}>Keywords <Text style={styles.star}>*</Text></Text>
      <TextInput
        style={styles.input}
        placeholder="Add Keywords (comma separated)"
        placeholderTextColor="gray"
        value={keywords}
        onChangeText={handleKeywordsChange}
      />

      <Text style={styles.header}>Set MBTI Types (Multiple Possible) <Text style={styles.star}>*</Text></Text>

      <MultiSelect
        items={mbtiTypes}
        uniqueKey="value"
        onSelectedItemsChange={setMbti}
        selectedItems={mbti}
        selectText="Pick MBTI Types"
        searchInputPlaceholderText="Search Items..."
        selectedText="Picked"
        tagRemoveIconColor={theme.colors.primary}
        tagBorderColor={theme.colors.primary}
        tagTextColor={theme.colors.primary}
        selectedItemTextColor={theme.colors.onTertiaryContainer}
        selectedItemIconColor={theme.colors.onTertiaryContainer}
        itemTextColor="black"
        displayKey="label"
        searchInputStyle={{ color: "black", backgroundColor: theme.colors.primaryContainer }}
        submitButtonColor={theme.colors.primary}
        submitButtonText="Confirm"
        styleDropdownMenu={{
          paddingLeft: 15,
          width: 300,
          height: 50,
          margin: 12,
          borderWidth: 1,
          backgroundColor: theme.colors.primaryContainer,
        }}
        styleTextDropdown={{ color: "gray", fontSize: 16 }}
        styleTextDropdownSelected={{ color: "gray", fontSize: 16 }}
        styleDropdownMenuSubsection={{ backgroundColor: theme.colors.primaryContainer, height: 45 }}
        fixedHeight={true}
        styleItemsContainer={{ backgroundColor: theme.colors.tertiaryContainer, maxHeight: 150, width: 325 }}
        styleSelectorContainer={{ marginTop: 12 }}
        styleIndicator={{ backgroundColor: theme.colors.primaryContainer }}
        styleMainWrapper={{ width: 325 }}
        styleInputGroup={{ backgroundColor: theme.colors.primaryContainer }}
      />

      <Text style={styles.header}>Select relevant job fields. <Text style={styles.star}>*</Text></Text>

      <MultiSelect
        items={jobFieldTypes}
        uniqueKey="value"
        onSelectedItemsChange={setJobField}
        selectedItems={jobField}
        selectText="Select Job Fields"
        searchInputPlaceholderText="Search Items..."
        selectedText="Selected"
        tagRemoveIconColor={theme.colors.primary}
        tagBorderColor={theme.colors.primary}
        tagTextColor={theme.colors.primary}
        selectedItemTextColor={theme.colors.onTertiaryContainer}
        selectedItemIconColor={theme.colors.onTertiaryContainer}
        itemTextColor="black"
        displayKey="label"
        searchInputStyle={{ color: "black", backgroundColor: theme.colors.primaryContainer }}
        submitButtonColor={theme.colors.primary}
        submitButtonText="Confirm"
        styleDropdownMenu={{
          paddingLeft: 15,
          width: 300,
          height: 50,
          margin: 12,
          borderWidth: 1,
          backgroundColor: theme.colors.primaryContainer,
        }}
        styleTextDropdown={{ color: "gray", fontSize: 16 }}
        styleTextDropdownSelected={{ color: "gray", fontSize: 16 }}
        styleDropdownMenuSubsection={{ backgroundColor: theme.colors.primaryContainer, height: 45 }}
        fixedHeight={true}
        styleItemsContainer={{ backgroundColor: theme.colors.tertiaryContainer, maxHeight: 150, width: 325 }}
        styleSelectorContainer={{ marginTop: 12 }}
        styleIndicator={{ backgroundColor: theme.colors.primaryContainer }}
        styleMainWrapper={{ width: 325 }}
        styleInputGroup={{ backgroundColor: theme.colors.primaryContainer }}
      />


      <Text style={styles.header}>Select Holland Code types <Text style={styles.star}>*</Text></Text>

      <MultiSelect
        items={hollandCodeTypes}
        uniqueKey="value"
        onSelectedItemsChange={setHc}
        selectedItems={hc}
        selectText="Select Holland Code Types"
        searchInputPlaceholderText="Search Items..."
        selectedText="Selected"
        tagRemoveIconColor={theme.colors.primary}
        tagBorderColor={theme.colors.primary}
        tagTextColor={theme.colors.primary}
        selectedItemTextColor={theme.colors.onTertiaryContainer}
        selectedItemIconColor={theme.colors.onTertiaryContainer}
        itemTextColor="black"
        displayKey="label"
        searchInputStyle={{ color: "black", backgroundColor: theme.colors.primaryContainer }}
        submitButtonColor={theme.colors.primary}
        submitButtonText="Confirm"
        styleDropdownMenu={{
          paddingLeft: 15,
          width: 300,
          height: 50,
          margin: 12,
          borderWidth: 1,
          backgroundColor: theme.colors.primaryContainer,
        }}
        styleTextDropdown={{ color: "gray", fontSize: 16 }}
        styleTextDropdownSelected={{ color: "gray", fontSize: 16 }}
        styleDropdownMenuSubsection={{ backgroundColor: theme.colors.primaryContainer, height: 45 }}
        fixedHeight={true}
        styleItemsContainer={{ backgroundColor: theme.colors.tertiaryContainer, maxHeight: 100, width: 325 }}
        styleSelectorContainer={{ marginTop: 12 }}
        styleIndicator={{ backgroundColor: theme.colors.primaryContainer }}
        styleMainWrapper={{ width: 325 }}
        styleInputGroup={{ backgroundColor: theme.colors.primaryContainer }}
      />

      <Text style={styles.header}>Additional Information</Text>
      <TextInput
        style={styles.input}
        placeholder="Add Additional Information"
        placeholderTextColor="gray"
        value={additionalInfo}
        onChangeText={handleAdditionalInfoChange}
      />

      {/*<Button style={styles.uploadBtn} onPress={uploadPDF} mode="contained">Upload Additional Job Information</Button>*/}

      <Button style={styles.postBtn} onPress={confirmJobPosting} mode="contained" disabled={!isFormValid}>Post
        Job</Button>


    </ScrollView>
  );
};


export default JobPosting;

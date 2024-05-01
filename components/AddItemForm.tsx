import React, { useState } from "react";
import { View, TextInput, StyleSheet, Text } from "react-native";
import {useTheme, Button} from "react-native-paper";

const AddItemForm: React.FC<{
  category: string,
  onSubmit: (formData: any) => void,
  onClose: () => void,
}> = ({ category, onSubmit, onClose }) => {
  const theme = useTheme();
  const initialFormData = getInitialFormData(category);
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState({});
  const validator = require("email-validator");

  const checkValid = () => {
    let errorCurrent = {};
    switch (category) {
      case "Education":
        if (!formData.degree || formData.degree.length >= 400) {
          errorCurrent = {...errorCurrent, degree: "Degree must be between 1 and 400 characters"};
        }
        if (!formData.institution || formData.institution.length >= 400) {
          errorCurrent = {...errorCurrent, institution: "Institution must be between 1 and 400 characters"};
        }
        if (!formData.duration || formData.duration.length >= 80) {
          errorCurrent = {...errorCurrent, duration: "Duration must be between 1 and 80 characters"};
        }
        break;
      case "Work Experience":
        if (!formData.company || formData.company.length >= 400) {
          errorCurrent = {...errorCurrent, company: "Company must be between 1 and 400 characters"};
        }
        if (!formData.position || formData.position.length >= 400) {
          errorCurrent = {...errorCurrent, position: "Position must be between 1 and 400 characters"};
        }
        if (!formData.duration || formData.duration.length >= 80) {
          errorCurrent = {...errorCurrent, duration: "Duration must be between 1 and 80 characters"};
        }
        break;
      case "Interests":
        if (!formData.interest || formData.interest.length >= 1000) {
          errorCurrent = {...errorCurrent, interest: "Interest must be between 1 and 1000 characters"};
        }
        break;
      case "Skills":
        if (!formData.skill || formData.skill.length >= 1000) {
          errorCurrent = {...errorCurrent, skill: "Skill must be between 1 and 1000 characters"};
        }
        break;
      case "Contact Information":
        if (!validator.validate(formData.email)) {
          errorCurrent = {...errorCurrent, email: "Email is not valid"};
        }
        if (!formData.phone || formData.phone.length >= 80) {
          errorCurrent = {...errorCurrent, phone: "Phone must be between 1 and 80 characters"};
        }
        if (!formData.address || formData.address.length >= 1000) {
          errorCurrent = {...errorCurrent, address: "Address must be between 1 and 1000 characters"};
        }
        break;
      case "Other":
        if (!formData.other || formData.other.length >= 1000) {
          errorCurrent = {...errorCurrent, other: "This field must be between 1 and 1000 characters"};
        }
        break;
      default:
        break;
    }
    setError(errorCurrent);
    return Object.keys(errorCurrent).length === 0;
  };

  const handleSubmit = () => {
    if (checkValid()) {
      onSubmit(formData);
    }
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    onClose();
  };

  const handleChange = (fieldName: string, value: string) => {
    setFormData({ ...formData, [fieldName]: value });
  };

  const styles = StyleSheet.create({
    bg: {
      backgroundColor: "rgba(0,0,0,0.7)",
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      paddingHorizontal: 20,
      paddingVertical: 20,
      backgroundColor: theme.colors.primaryContainer,
      width: "80%",
    },
    input: {
      backgroundColor: theme.colors.scrim,
      borderWidth: 1,
      borderColor: "white",
      borderRadius: 5,
      paddingHorizontal: 10,
      paddingVertical: 8,
      marginBottom: 10,
      color: "white",
    },
    button: {
      backgroundColor: theme.colors.secondary,
      color: "white",
      borderRadius: 10,
      textAlign: "center",
      marginTop: 20,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      width: "60%",
    },
    error: {
      color: theme.colors.error,
      marginBottom: 5,
    },
  });

  const renderInputs = () => {
    switch (category) {
      case "Education":
        return (
          <View style={styles.container}>
            <TextInput
              style={styles.input}
              placeholder="Enter degree"
              placeholderTextColor="grey"
              value={formData.degree || ""}
              onChangeText={(text) => handleChange("degree", text)}
            />
            {
            // @ts-ignore
            error.degree && <Text style={styles.error}>{error.degree}</Text>
            }
            <TextInput
              style={styles.input}
              placeholder="Enter institution"
              placeholderTextColor="grey"
              value={formData.institution || ""}
              onChangeText={(text) => handleChange("institution", text)}
            />
            {
            // @ts-ignore
            error.institution && <Text style={styles.error}>{error.institution}</Text>
            }
            <TextInput
              style={styles.input}
              placeholder="Enter duration"
              placeholderTextColor="grey"
              value={formData.duration || ""}
              onChangeText={(text) => handleChange("duration", text)}
            />
            {
            // @ts-ignore
            error.duration && <Text style={styles.error}>{error.duration}</Text>
            }
          </View>
        );
      case "Work Experience":
        return (
          <View style={styles.container}>
            <TextInput
              style={styles.input}
              placeholder="Enter company"
              placeholderTextColor="grey"
              value={formData.company || ""}
              onChangeText={(text) => handleChange("company", text)}
            />
            {
            // @ts-ignore
            error.company && <Text style={styles.error}>{error.company}</Text>
            }
            <TextInput
              style={styles.input}
              placeholder="Enter position"
              placeholderTextColor="grey"
              value={formData.position || ""}
              onChangeText={(text) => handleChange("position", text)}
            />
            {
            // @ts-ignore
            error.position && <Text style={styles.error}>{error.position}</Text>
            }
            <TextInput
              style={styles.input}
              placeholder="Enter duration"
              placeholderTextColor="grey"
              value={formData.duration || ""}
              onChangeText={(text) => handleChange("duration", text)}
            />
            {
            // @ts-ignore
            error.duration && <Text style={styles.error}>{error.duration}</Text>
            }
          </View>
        );

      case "Interests":
        return (
          <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Enter interest"
            placeholderTextColor="grey"
            value={formData.interest || ""}
            multiline

            onChangeText={(text) => handleChange("interest", text)}
          />
            {
            // @ts-ignore
            error.interest && <Text style={styles.error}>{error.interest}</Text>
            }
          </View>
        );

      case "Skills":
        return (
          <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Enter skill"
            value={formData.skill || ""}
            placeholderTextColor="grey"
            onChangeText={(text) => handleChange("skill", text)}
          />
            {
            // @ts-ignore
            error.skill && <Text style={styles.error}>{error.skill}</Text>
            }
          </View>
        );

      case "Contact Information":
        return (
          <View style={styles.container}>
            <TextInput
              style={styles.input}
              placeholder="Enter email"
              placeholderTextColor="grey"
              autoCapitalize="none"
              value={formData.email || ""}
              onChangeText={(text) => handleChange("email", text)}
            />
            {
            // @ts-ignore
            error.email && <Text style={styles.error}>{error.email}</Text>
            }
            <TextInput
              style={styles.input}
              placeholder="Enter phone"
              placeholderTextColor="grey"
              value={formData.phone || ""}
              onChangeText={(text) => handleChange("phone", text)}
            />
            {
            // @ts-ignore
            error.phone && <Text style={styles.error}>{error.phone}</Text>
            }
            <TextInput
              style={styles.input}
              placeholder="Enter address"
              placeholderTextColor="grey"
              value={formData.address || ""}
              onChangeText={(text) => handleChange("address", text)}
            />
            {
            // @ts-ignore
            error.address && <Text style={styles.error}>{error.address}</Text>
            }
          </View>
        );
      case "Other":
        return (
          <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Enter other"
            placeholderTextColor="grey"
            value={formData.other || ""}
            onChangeText={(text) => handleChange("other", text)}
          />
            {
            // @ts-ignore
            error.other && <Text style={styles.error}>{error.other}</Text>
            }
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.bg}>
      {renderInputs()}
      <View style={styles.buttonContainer}>
        <Button mode={"contained"} style={styles.button} onPress={handleSubmit}>
          <Text>Submit</Text>
        </Button>
        <Button mode={"contained"} style={styles.button} onPress={handleCancel}>
          <Text>Cancel</Text>
        </Button>
      </View>
    </View>
  );
};

const getInitialFormData = (category: string) => {
  switch (category) {
    case "Education":
      return { degree: "", institution: "", duration: "" };
    case "Work Experience":
      return { company: "", position: "", duration: "" };
    case "Interests":
      return { interest: "" };
    case "Skills":
      return { skill: "" };
    case "Contact Information":
      return { email: "", phone: "", address: "" };
    case "Other":
      return { other: "" };
    default:
      return {};
  }
};

export default AddItemForm;

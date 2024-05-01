import React, { useEffect } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { MainDrawerProps } from "../../util/nav.ts";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { Text, useTheme, TextInput, Button } from "react-native-paper";
import {AccountService} from '../../api/';
import { doApiRequest } from "../../util/api.tsx";

const GoalMotivationInput: React.FC<DrawerScreenProps<MainDrawerProps, "GoalMotivationInput">> = ({ navigation }) => {
  const [shortTermGoal, setShortTermGoal] = React.useState<string>("");
  const [longTermGoal, setLongTermGoal] = React.useState<string>("");
  const [motivation1, setMotivation1] = React.useState<string>("");
  const [motivation2, setMotivation2] = React.useState<string>("");
  const [motivation3, setMotivation3] = React.useState<string>("");
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
  const theme = useTheme();

  const checkValid = () => {
    let newErrors: { [key: string]: string } = {};
    if (shortTermGoal === "") {
      newErrors = { ...newErrors, shortTermGoal: "Short-term goal is required" };
    }
    if (longTermGoal === "") {
      newErrors = { ...newErrors, longTermGoal: "Long-term goal is required" };
    }
    if (motivation1 === "") {
      newErrors = { ...newErrors, motivation1: "Motivation 1 is required" };
    }
    if (motivation2 === "") {
      newErrors = { ...newErrors, motivation2: "Motivation 2 is required" };
    }
    if (motivation3 === "") {
      newErrors = { ...newErrors, motivation3: "Motivation 3 is required" };
    }
    if (shortTermGoal.length > 50) {
      newErrors = { ...newErrors, shortTermGoal: "Short-term goal must be less than 50 characters" };
    }
    if (longTermGoal.length > 150) {
      newErrors = { ...newErrors, longTermGoal: "Long-term goal must be less than 150 characters" };
    }
    if (motivation1.length > 50) {
      newErrors = { ...newErrors, motivation1: "Motivation 1 must be less than 50 characters" };
    }
    if (motivation2.length > 50) {
      newErrors = { ...newErrors, motivation2: "Motivation 2 must be less than 50 characters" };
    }
    if (motivation3.length > 50) {
      newErrors = { ...newErrors, motivation3: "Motivation 3 must be less than 50 characters" };
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    console.log(errors); // Log errors when it's updated
  }, [errors]); // Run this effect whenever errors state changes

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white",
    },
    goal: {
      padding: 20,
    },
    title: {
      fontWeight: "bold",
      fontSize: 20,
      paddingLeft: 20,
      color: theme.colors.primary,
    },
    header: {
      fontSize: 16,
      color: theme.colors.primary,
      marginBottom: 10,
      marginTop: 10,
    },
    input: {
      minHeight: 40,
      borderColor: "gray",
      borderWidth: 1,
      marginBottom: 20,
      backgroundColor: theme.colors.primaryContainer,
      color: theme.colors.onPrimaryContainer,
    },
    star: {
      color: "red",
      fontSize: 1.1 * 18,
    },
    button: {
      margin: 20,
      alignSelf: "center",
    },
    error: {
      color: theme.colors.error,
      marginBottom: 10,
    },
  });

  const sendData = async () => {
    await doApiRequest(AccountService.goal, shortTermGoal, longTermGoal, motivation1, motivation2, motivation3);
    navigation.navigate('Resume', {});
  };

  const handleSubmit = () => {
    if (checkValid()) {
      setErrors({});
      Alert.alert(
        'You must now create your resume!',
        'Click Proceed to continue',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Proceed',
            onPress: sendData,
          },
        ],
      );
    }
  };
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>You must enter a short-term and long-term goal.</Text>
      <View style={styles.goal}>
        <Text style={styles.header}>Short-term goal <Text style={styles.star}>*</Text></Text>
        <TextInput
          style={styles.input}
          onChangeText={text => setShortTermGoal(text)}
          value={shortTermGoal}
          placeholder="Enter your short-term goal"
          placeholderTextColor="grey"
          multiline
        />
        {
          errors.shortTermGoal ? <Text style={styles.error}>{errors.shortTermGoal}</Text> : null
        }
        <Text style={styles.header}>Long-term goal <Text style={styles.star}>*</Text></Text>
        <TextInput
          style={{ ...styles.input, textAlignVertical: "top" }}
          onChangeText={text => setLongTermGoal(text)}
          value={longTermGoal}
          placeholder="Enter your long-term goal"
          placeholderTextColor="grey"
          multiline={true}
          numberOfLines={10}
          contentStyle={{ height: 150 }}
        />
        {
          errors.longTermGoal ? <Text style={styles.error}>{errors.longTermGoal}</Text> : null
        }
      </View>
      <View style={styles.goal}>
        <Text style={styles.title}>Now, you must enter three motivations.</Text>
        <Text style={styles.header}>Motivation 1 <Text style={styles.star}>*</Text></Text>
        <TextInput
          style={styles.input}
          onChangeText={text => setMotivation1(text)}
          value={motivation1}
          placeholder="Enter your motivation"
          placeholderTextColor="grey"
          multiline
        />
        {
          errors.motivation1 ? <Text style={styles.error}>{errors.motivation1}</Text> : null
        }
        <Text style={styles.header}>Motivation 2 <Text style={styles.star}>*</Text></Text>
        <TextInput
          style={styles.input}
          onChangeText={text => setMotivation2(text)}
          value={motivation2}
          placeholder="Enter your motivation"
          placeholderTextColor="grey"
          multiline
        />
        {
          errors.motivation2 ? <Text style={styles.error}>{errors.motivation2}</Text> : null
        }
        <Text style={styles.header}>Motivation 3 <Text style={styles.star}>*</Text></Text>
        <TextInput
          style={styles.input}
          onChangeText={text => setMotivation3(text)}
          value={motivation3}
          placeholder="Enter your motivation"
          placeholderTextColor="grey"
          multiline
        />
        {
          errors.motivation3 ? <Text style={styles.error}>{errors.motivation3}</Text> : null
        }
      </View>
      <Button onPress={handleSubmit} mode={"contained"} style={styles.button}>
        Confirm
      </Button>
    </ScrollView>
  );
};

export default GoalMotivationInput;

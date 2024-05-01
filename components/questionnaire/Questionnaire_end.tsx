import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Button, Text, useTheme } from "react-native-paper";
import { MainDrawerProps } from "../../util/nav.ts";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { QuestionService } from "../../api";

const Holland_codes = ["Realistic", "Investigative", "Artistic", "Social", "Enterprising", "Conventional"];
const MBTI_types = [["E", "I"], ["S", "N"], ["T", "F"], ["J", "P"]];
const fieldsDictionary = [
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


const Questionnaire_end: React.FC<DrawerScreenProps<MainDrawerProps, "questionnaire_end">> = (
    { navigation, route}) => {
  const [codeOne, setCodeOne] = useState("");
  const [codeTwo, setCodeTwo] = useState("");
  const [MBTI_type, setMBTI_type] = useState("");
  const [category_one, setCategoryOne] = useState("");
  const [category_two, setCategoryTwo] = useState("");
  const [category_three, setCategoryThree] = useState("");
  const [errors, setErrors] = useState({});

  const checkValid = useMemo(() => {
    if (category_one === "" || category_two === "" || category_three === "") {
      setErrors({ ...errors, category: "Please select all categories" });
      return false;
    }
    return true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category_one, category_two, category_three]);

  const results_MBTI = route.params.MBTI_res;
  const results_Holland = route.params.Holland_res;

  useEffect(() => {
    let temp_list = [0, 0, 0, 0, 0, 0];

    if (Array.isArray(results_Holland) && results_Holland.every(val => typeof val === "number")) {
      setCodeOne(Holland_codes[results_Holland[0]]);
      if (results_Holland[1] !== undefined) {
        setCodeTwo(Holland_codes[results_Holland[1]]);
      }
      return;
    }

    for (let i = 0; i < results_Holland.length; i++) {
      for (let j = 0; j < results_Holland[i].length; j++) {
        let index = results_Holland[i][j];
        temp_list[index] = temp_list[index] + 1;
      }

    }
    let largest = Math.max(...temp_list);
    const index_one = temp_list.indexOf(largest);

    temp_list[index_one] = -Infinity;

    largest = Math.max(...temp_list) === 0 ? -1 : Math.max(...temp_list);
    const index_two = temp_list.indexOf(largest);
    if (index_two !== -1) {
      setCodeOne(Holland_codes[index_one]);
      setCodeTwo(Holland_codes[index_two]);
    } else {
      setCodeOne(Holland_codes[index_one]);
    }
  }, [setCodeOne, setCodeTwo, results_Holland]);

  useEffect(() => {
    if (typeof results_MBTI === "string") {
      setMBTI_type(results_MBTI);
      console.log(MBTI_type);
      return;
    }
    let temp_list = [[1, 0], [0, 2], [1, 0], [0, 5]];
    for (let i = 0; i < (results_MBTI.length / 4); i++) {
      if (results_MBTI[(4 * i)] !== 1) {
        temp_list[0][0] = temp_list[0][0] + 1;
      } else {
        temp_list[0][1] = temp_list[0][1] + 1;
      }
      if (results_MBTI[1 + (4 * i)] !== 1) {
        temp_list[1][0] = temp_list[1][0] + 1;
      } else {
        temp_list[1][1] = temp_list[1][1] + 1;
      }
      if (results_MBTI[2 + (4 * i)] !== 1) {
        temp_list[2][0] = temp_list[2][0] + 1;
      } else {
        temp_list[2][1] = temp_list[2][1] + 1;
      }
      if (results_MBTI[3 + (4 * i)] !== 1) {
        temp_list[3][0] = temp_list[3][0] + 1;
      } else {
        temp_list[3][1] = temp_list[3][1] + 1;
      }
    }
    let results = ["A", "A", "A", "A"];
    for (let i = 0; i < temp_list.length; i++) {
      const largerIndex = temp_list[i][0] >= temp_list[i][1] ? 0 : 1;
      results[i] = MBTI_types[i][largerIndex];
    }
    setMBTI_type(results.join(""));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setMBTI_type, results_MBTI]);

  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.primaryContainer,
    },
    container_dropdown: {
      backgroundColor: theme.colors.surface,
      padding: 20,
      width: '100%',
      color: "black",
    },
    dropdown_style: {
      padding: 10,
      backgroundColor: theme.colors.primaryContainer,
      color: "black",
      marginTop: 5,
      marginBottom: 10,
      borderRadius: 15,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
    },
    title: {
      fontWeight: "bold",
      color: theme.colors.primary,
    },
    subHeader: {
      marginTop: 0,
      fontSize: 13,
      padding: 20,
    },
    checkboxContainer: {
      flexDirection: "row",
      marginBottom: 20,
    },
    button: {
      alignItems: "center",
      backgroundColor: "#FFFFFF",
      padding: 10,
      marginBottom: 10,
    },
  });

  useEffect(() => {
    console.log("TEST " + codeTwo);
  }, [codeTwo]);

  const handleSubmit = async () => {
    try {
      QuestionService.questionResult(MBTI_type, codeOne, codeTwo, category_one, category_two, category_three);
      setErrors({});
      navigation.navigate("QuestionsResults", {
        mbtiType: MBTI_type,
        codeOne: codeOne,
        codeTwo: codeTwo,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{width: '100%', padding: 20, backgroundColor: theme.colors.primaryContainer}}>
        <Text variant="headlineLarge" style={styles.title}>You're almost finished</Text>
      </View>
      <View style={{flex: 1,backgroundColor: 'white',borderTopLeftRadius: 30, borderTopRightRadius: 30}}>

      <Text style={{ padding: 20, textAlign: 'center'} } variant="bodyLarge">
        Select the categories your degree {"\n"} would fall in:
      </Text>
      <View style={styles.container_dropdown}>
        <Dropdown
          style={styles.dropdown_style}
          data={fieldsDictionary}
          value={category_one}
          search
          searchPlaceholder="Search.."
          placeholder="Select item"
          labelField="label"
          valueField="value"
          placeholderStyle={{ color: "gray" }}
          maxHeight={300}
          onChange={item => {
            setCategoryOne(item.value);
          }}
          inputSearchStyle={{ color: theme.colors.onPrimaryContainer, backgroundColor: theme.colors.primaryContainer, margin: 0, marginBottom: 0}}
          itemContainerStyle={{ backgroundColor: theme.colors.primaryContainer }}
          selectedTextStyle={{ color: theme.colors.onPrimaryContainer}}
          renderItem={(item, isSelected) => (
            <Text style={{ padding: 10, color: theme.colors.onPrimaryContainer, fontSize: 16,
              backgroundColor: !isSelected? theme.colors.primaryContainer: theme.colors.tertiaryContainer}}>
              {item.label}
            </Text>
          )}
        />
        <Dropdown
          style={styles.dropdown_style}
          data={fieldsDictionary}
          value={category_two}
          searchPlaceholder="Search.."
          search = {true}
          labelField="label"
          valueField="value"
          maxHeight={300}
          placeholderStyle={{ color: "gray" }}
          onChange={item => {
            setCategoryTwo(item.value);
          }}
          inputSearchStyle={{ color: theme.colors.onPrimaryContainer, backgroundColor: theme.colors.primaryContainer, margin: 0, marginBottom: 0}}
          itemContainerStyle={{ backgroundColor: theme.colors.primaryContainer }}
          selectedTextStyle={{ color: theme.colors.onPrimaryContainer}}
          renderItem={(item, isSelected) => (
            <Text style={{ padding: 10, color: theme.colors.onPrimaryContainer, fontSize: 16,
              backgroundColor: !isSelected? theme.colors.primaryContainer: theme.colors.tertiaryContainer}}>
              {item.label}
            </Text>
          )}
        />

        <Dropdown
          style={styles.dropdown_style}
          data={fieldsDictionary}
          placeholderStyle={{ color: "gray" }}
          value={category_three}
          search
          searchPlaceholder="Search..."
          labelField="label"
          valueField="value"
          maxHeight={300}
          onChange={item => {
            setCategoryThree(item.value);
          }}
          inputSearchStyle={{ color: theme.colors.onPrimaryContainer, backgroundColor: theme.colors.primaryContainer, margin: 0, marginBottom: 0}}
          itemContainerStyle={{ backgroundColor: theme.colors.primaryContainer }}
          selectedTextStyle={{ color: theme.colors.onPrimaryContainer}}
          renderItem={(item, isSelected) => (
            <Text style={{ padding: 10, color: theme.colors.onPrimaryContainer, fontSize: 16,
              backgroundColor: !isSelected? theme.colors.primaryContainer: theme.colors.tertiaryContainer}}>
              {item.label}
            </Text>
          )}
        />
        <Button mode="contained" onPress={() => handleSubmit()} disabled={!checkValid}>Finish</Button>
      </View>
      </View>

    </View>

  );
};


export default Questionnaire_end;

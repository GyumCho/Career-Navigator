import React, { useMemo } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Button, Text, Chip, Divider, useTheme } from "react-native-paper";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { MainDrawerProps } from "../../util/nav.ts";


const Questionnaire_Intro: React.FC<DrawerScreenProps<MainDrawerProps, "questionnaire_intro">> = ({ navigation }) => {
    const [selectedMBTI, setSelectedMBTI] = React.useState<string | null>(null);
    const [selectedHolland, setSelectedHolland] = React.useState<string[]>([]);

    const list_personalities = ["ISTJ", "ISFJ", "INFJ", "INTJ", "ISTP", "ISFP", "INFP", "INTP", "ESTP", "ESFP", "ENFP", "ENTP", "ESTJ", "ESFJ", "ENFJ", "ENTJ"];
    const list_hollandCode = ["Realistic", "Investigative", "Artistic", "Social", "Enterprising", "Conventional"];

    const onMBTIToggle = (personality: string) => {
      setSelectedMBTI(personality);
    };

    const onHollandToggle = (code: string) => {
      if (selectedHolland.includes(code)) {
        setSelectedHolland(selectedHolland.filter(item => item !== code)); // Deselect
      } else if (selectedHolland.length < 2) {
        setSelectedHolland([...selectedHolland, code]); // Select, if less than 2 already selected
      }
      // If already 2 selected, do nothing or possibly alert the user
    };

    const checkValid = useMemo(() => {
      let errors: { [key: string]: string } = {};
      if (selectedMBTI === null) {
        errors = { ...errors, mbti: "MBTI is required" };
      }
      if (!(selectedHolland.length > 0 && selectedHolland.length <= 2)) {
        errors = { ...errors, mbti: "1 or 2 holland code is required" };
      }
      return Object.keys(errors).length === 0;
    }, [selectedMBTI, selectedHolland]);

    const createViewMBTI = () => {
      return list_personalities.map((personality, index) => (
        <Chip
          key={index}
          mode="flat"
          selected={selectedMBTI === personality}
          onPress={() => onMBTIToggle(personality)}
          style={{ marginRight: 10, marginBottom: 10 }}
          textStyle={{ fontSize: 13, fontWeight: "bold" }}>
          {personality}
        </Chip>
      ));
    };

    const createViewHolland = () => {
      return list_hollandCode.map((code, index) => (
        <Chip
          key={index}
          mode="flat"
          selected={selectedHolland.includes(code)}
          onPress={() => onHollandToggle(code)}
          style={{ marginRight: 20, marginBottom: 10 }}>
          {code}
        </Chip>
      ));
    };

    const theme = useTheme();

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: theme.colors.primaryContainer,
      },
      Title: {
        fontWeight: "bold",
      },
      subHeader: {
        padding: 20,
        color: "black",
      },
      checkboxContainer: {
        flexDirection: "row", // Display checkboxes in a row
        marginBottom: 20,
      },
      surface: {
        backgroundColor: "white",
        width: "90%",
        padding: 20,
        alignItems: "center",
        borderRadius: 20,
        margin: 20,
      },
      scrollView_Surface: {
        padding: 10,
        backgroundColor: "white",
        width: "90%",
        paddingBottom: 30,
        borderRadius: 20,
        margin: 20,
      },
      nextButton: {
        marginBottom: 20,
        width: 200,
      },
      divider: {
        width: "90%",
        height: "0.05%",
        backgroundColor: "black",
        elevation: 10,
      },
    });

  const getIndices = (mainList: string[], sublist: string[]): number[] => {
    // console.log(selectedMBTI);
    // console.log(selectedHolland);
    const indices: number[] = [];
    sublist.forEach((item) => {
      const index = mainList.indexOf(item);
      if (index !== -1) {
        indices.push(index);
      }
    });
    console.log(indices);
    return indices;
  };


    return (
      <View style={styles.container}>
        <View style={{ width: "100%", padding: 20, backgroundColor: theme.colors.primaryContainer }}>
          <Text variant="headlineLarge" style={{ fontWeight: "bold", color: theme.colors.primary }}> Welcome!</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: "white", borderTopLeftRadius: 30, borderTopRightRadius: 30 }}>
          <View style={styles.surface}>
            <Text variant="bodyLarge" style={styles.subHeader}>
              The following are a series of questions which aim to figure out your personality type (MBTI) and the type of
              code you fall under (Holland Code).{"\n"}
            </Text>

            <Button mode="contained" style={styles.nextButton}
                    onPress={() => navigation.navigate("questionnaire_MBTI", {})}>
              Get started
            </Button>
          </View>
          <Divider style={{ margin: 5 }} />
          <Text variant="titleLarge" style={{ fontWeight: "bold", textAlign: "center" }}>OR...</Text>
          <Text variant="labelLarge" style={{ padding: 20, textAlign: "center" }}>If you already know your MBTI and Holland code, select them below:</Text>
          <ScrollView style={styles.scrollView_Surface}
                      contentContainerStyle={{ alignItems: "center", justifyContent: "center" }}>
            <Text variant="labelLarge" style={{ fontWeight: "bold", marginBottom: 10 }}>MBTI</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
              {createViewMBTI()}
            </View>
            <Text variant="labelLarge" style={{ fontWeight: "bold", marginBottom: 10 }}>Holland code</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
              {createViewHolland()}
            </View>
            <Button mode="contained" style={styles.nextButton} disabled={!checkValid} onPress={() => navigation.navigate("questionnaire_end", {
              MBTI_res : selectedMBTI,
              Holland_res : getIndices(list_hollandCode, selectedHolland),
            })}>
              Go to end
            </Button>
          </ScrollView>
        </View>
      </View>
    );
  }
;

/*{'\n'}Keep in mind for the following while answering:
      {'\n'}{'\u2022'}There are no right answers to any of these questions.
      {'\n'}{'\u2022'}Answer the questions quickly, do not over-analyze them
      {'\n'}{'\u2022'}Answer the questions as “the way you are”, not “the way {'\t'} you’d like to be seen by others{'\n'}*/


export default Questionnaire_Intro;


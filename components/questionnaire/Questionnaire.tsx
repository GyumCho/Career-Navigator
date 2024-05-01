import React, { Reducer, useReducer, useState } from "react";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { StyleSheet, View, Pressable } from "react-native";
import { Button, ProgressBar, Text, useTheme } from "react-native-paper";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { MainDrawerProps } from "../../util/nav.ts";


const Questionnaire: React.FC<DrawerScreenProps<MainDrawerProps, 'questionnaire_MBTI'>> = ({ navigation }) => {
  const [{a, b}, cb] = useReducer<Reducer<{a: boolean, b: boolean}, 'a'|'b'|''>>((state, action) => {
    if (action === 'a') {
      return {a: true, b: false};
    } else if (action === 'b') {
      return {a: false, b: true};
    } else {
      return {a: false, b: false};
    }
  }, {a: false, b: false});
  const [results, setResults] = useState<(0 | 1)[]>([]);
  const [errorMessage, setErrorMessage] = useState<string|null>(null);

  let bouncyCheckboxRefA: BouncyCheckbox | null = null;
  let bouncyCheckboxRefB: BouncyCheckbox | null = null;

  /*fix usage */

  const questions = ["At parties do you:", "Are you more:", "Is it worse to:", "Are you more impressed by:"];
  const answers = [
    ["Interact with many, including strangers", "Interact with a few, known to you "],
    ["Realistic than speculative", "Speculative than realistic"],
    ["Have your “head in the clouds\" ", "Be “in a rut”"],
    ["Principles", "Emotions"],
  ];


  const submit = () => {
    if (a === false && b === false) {
      setErrorMessage("You haven't selected any choices!");
    } else {
      const newValue = a ? 0 : 1;
      setResults((prevResults) => ([...prevResults, newValue]));
      cb('');
      setErrorMessage(null);
    }
  };

  const theme = useTheme();
  const numQuestions = questions.length;
  const allQuestionsAnswered = results.length >= numQuestions;

  const styles = StyleSheet.create({
    container: {
      height: "100%",
      width: "100%",
      backgroundColor: theme.colors.primaryContainer,
    },
    questionContainer: {
      backgroundColor: theme.colors.primaryContainer,
      height: 150,
      padding: 20,
    },
    answerContainer: {
      backgroundColor: theme.colors.background,
      width: '100%',
      height: '100%',
      borderTopRightRadius: 30,
      borderTopLeftRadius: 30,
      padding: 20,
      alignItems: "center",
    },
    container_green: {
      height: "100%",
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#DDDDDD",
    },
    checkboxContainer: {
      flexDirection: "row", // Display checkboxes in a row
      marginBottom: 10,
      paddingHorizontal: 10,
      paddingVertical: 20,
      borderRadius: 30,
      borderWidth: 2,
    },
    checkbox: {
      alignSelf: "center",
    },
    button: {
      alignItems: "center",
      backgroundColor: "#DDDDDD",
      padding: 10,
      marginBottom: 10,
    },
    next_page: {
      height: "100%",
      width: "100%",
      backgroundColor: theme.colors.primaryContainer,
    },
    header: {
      fontWeight: "bold",
      textAlign: 'center',
    },
    subHeader: {
      padding: 10,
      textAlign: 'center',
    },
    title: {
      fontWeight: "bold",
    },
    textContainer: {
      margin: 10,
      width: '100%',
    },
    nextButton: {
      width: "100%",
      marginHorizontal: 40,
    },
    questionPressable: {
      width: "100%",
      marginHorizontal: 40,
    },
  });

  return (
    <View style={styles.container}>
      {!allQuestionsAnswered ? (
        <View>
          <View style={styles.questionContainer}>
            <Text style={{ textAlign: "center", marginBottom: 10 }}
                  variant="bodyLarge">{results.length} of {numQuestions}</Text>
            <ProgressBar style={{ marginBottom: 20 }} progress={results.length / numQuestions} color={theme.colors.primary} />
            <Text style={styles.title} variant="headlineLarge">MBTI Test</Text>
          </View>
          <View style={styles.answerContainer}>
            <Text style={{ fontWeight: "bold", marginBottom: 20, padding: 10, textAlign: 'center'}}
                  variant="headlineMedium">{questions[Math.min(results.length, 3)]}</Text>
            <View style={styles.questionPressable}>
              <Pressable onPress={() => {
                bouncyCheckboxRefA?.onPress();
              }}>
                <View
                  style={{ ...styles.checkboxContainer, borderColor: a ? theme.colors.primary : "lightgray" }}>
                  <BouncyCheckbox
                    fillColor={a ? theme.colors.primary : "lightgray"}
                    disableBuiltInState
                    isChecked={a}
                    onPress={() => cb('a')}
                    ref={(ref: any) => (bouncyCheckboxRefA = ref)}
                  />
                  <Text variant="bodyLarge">{answers[Math.min(results.length, 3)][0]}</Text>
                </View>
              </Pressable>
            </View>
            <View style={styles.questionPressable}>
              <Pressable onPress={() => {
                bouncyCheckboxRefB?.onPress();
              }}>
                <View
                  style={{ ...styles.checkboxContainer, borderColor: b ? theme.colors.primary : "lightgray" }}>
                  <BouncyCheckbox
                    disableBuiltInState
                    isChecked={b}
                    fillColor={b ? theme.colors.primary : "lightgray"}
                    onPress={() => cb('b')}
                    ref={(ref: any) => (bouncyCheckboxRefB = ref)}
                  />
                  <Text variant="bodyLarge">{answers[Math.min(results.length, 3)][1]}</Text>
                </View>
              </Pressable>
            </View>
            <Button style={styles.nextButton} mode="contained" onPress={submit}>Next Question</Button>
            {
              (errorMessage) &&
              <View>
                <Text style={{ color: theme.colors.error, marginTop: 5 }}>{errorMessage}</Text>
              </View>
            }
          </View>
        </View>
      ) : (
        <View style={styles.next_page}>
          <View style={{width: '100%', justifyContent: 'center', height: '50%', backgroundColor: theme.colors.primaryContainer, padding: 20}}>

            <Text variant="headlineLarge" style={{... styles.header, color: theme.colors.primary}}>
              You have finished the first part!
            </Text>
            </View>
            <View style={{width:'100%', height:'100%', padding: 20,backgroundColor: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30}}>
              <Text variant="bodyLarge" style={styles.subHeader}>
                In the next part you will be doing a Holland Code quiz{"\n"}For each question, you must answer with one or two options.
              </Text>

              <Button mode="contained" onPress={() => navigation.navigate("questionnaire_Holland", {
                MBTI_res: results,
              })}>Continue</Button>
            </View>
        </View>
      )


      }

    </View>
  );
};


export default Questionnaire;

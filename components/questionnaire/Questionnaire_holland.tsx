import React, { useState} from 'react';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import {StyleSheet, View, Pressable} from "react-native";
import { Button, ProgressBar, Text, useTheme } from 'react-native-paper';
import { DrawerScreenProps } from "@react-navigation/drawer";
import { MainDrawerProps } from "../../util/nav.ts";

const Questionnaire_holland : React.FC<DrawerScreenProps<MainDrawerProps, 'questionnaire_Holland'>> = ({navigation, route}) => {
    const [results, setResults] = useState([]);
    const [showError, setShowError] = useState(false);
    const [checkboxList, setCheckboxList] = useState([false, false, false, false, false, false]);
    const [keyIndex, setKeyIndex] = useState(0);
    const [question, setQuestion] = useState(0);

    const results_MBTI = route.params.MBTI_res;
    // IMPROVE: store refs in list
    let bouncyCheckboxRefA: BouncyCheckbox | null = null;
    let bouncyCheckboxRefB: BouncyCheckbox | null = null;
    let bouncyCheckboxRefC: BouncyCheckbox | null = null;
    let bouncyCheckboxRefD: BouncyCheckbox | null = null;
    let bouncyCheckboxRefE: BouncyCheckbox | null = null;
    let bouncyCheckboxRefF: BouncyCheckbox | null = null;

    let keys = ["I am...", "I can..."];
    const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);
    let myQuestions: any = {
        'I am...': [
            ['Practical', 'Scientific', 'Creative', 'Friendly', 'Self-confident', 'Well organized'],
            ['Athletic', 'Precise', 'Imaginative', 'Generous', 'Persuasive', 'Efficient'],
        ],
        "I can...": [
            ["Fix electronic equipment", "Think abstractly", "Sketch, draw, paint", "Teach others", "Convince others to do things my way", "Work well within a system"],
            ["Play a sport", "Solve math problems", "Play a musical instrument", "Express myself clearly", "Sell things or promote ideas", "Keep accurate records"],
        ],
    };

    const getMyChoice = (index : number) => {
        return (myQuestions[keys[keyIndex]])[question][index];
    };

    const setChoice = (i : number) => {
        const newCheckBoxesList = [...checkboxList];
        newCheckBoxesList[i] = !newCheckBoxesList[i];
        setCheckboxList(newCheckBoxesList);
    };

    const buttonPress = () =>{
        let count : any = [];

        for (let i = 0; i < checkboxList.length; i++){
            if (checkboxList[i]) {
                count.push(i);
            }
        }

        if (count.length > 2 || count.length === 0){
            setShowError(true);
            return false;
        } else {
            // @ts-ignore
            setResults(prevResults => [...prevResults, count]);
            setShowError(false);
            if (question === (myQuestions[keys[keyIndex]].length) - 1 && keyIndex === (keys.length - 1) ){
                setAllQuestionsAnswered(true);
            }

            else if ( (myQuestions[keys[keyIndex]].length - 1) === question ){
                setKeyIndex(prev => prev + 1);
                setQuestion(0);
            } else {
                setQuestion(prev => prev + 1);
            }
            const oldCheckBoxesList = [...checkboxList];
            const listLength = oldCheckBoxesList.length;
            const newCheckBoxesList = Array(listLength).fill(false);
            setCheckboxList(newCheckBoxesList);
        }
        //bouncyCheckboxRef?.onPress();
    };
    const theme = useTheme();
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.colors.primaryContainer,
            flexDirection: 'row',
        },
        square: {
            width: '100%',
            borderColor: 'lightgray',
            flexDirection: 'row',
            marginBottom: 10,
            paddingHorizontal: 10,
            paddingVertical: 20,
            borderRadius : 30,
            borderWidth: 2,
        },
        next_page: {
            height : '100%',
            width : '100%',
            backgroundColor : 'white',
            borderRadius : 15,
            justifyContent : 'center',
            alignItems : 'center',
        },
        text_header: {
            fontWeight: 'bold',
            textAlign: 'center',
            alignItems: 'center',
        },
        text_subHeader: {
            padding: 10,
            textAlign: 'center',
        },
        button: {
            //fix
            width: '100%',
        },
        header : {
            color : 'white',
            fontWeight : 'bold',
            fontSize : 20,
        },
        subHeader : {
            padding : 10,
            textAlign: 'center',
        },
        button_two: {
            alignItems: 'center',
            backgroundColor: '#DDDDDD',
            padding: 10,
            marginBottom: 10,
        },
    });

    return (
      <View style={styles.container}>

          {!allQuestionsAnswered ?
            (
              <View style={{flex: 1}}>
                <View style={{ backgroundColor: theme.colors.primaryContainer, padding: 20}}>
                <ProgressBar style={{marginBottom: 20}} progress={(question + keyIndex * 2) / 4} color={theme.colors.primary}/>
                    <Text variant="displaySmall" style={styles.text_header}>Holland Code</Text>
                    <Text variant="headlineMedium" style={styles.text_subHeader}>{keys[keyIndex]}</Text>
                </View>
                <View style={{flex: 1, padding: 20,backgroundColor: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30}}>
                  <Pressable onPress={() => bouncyCheckboxRefA?.onPress()}>
                      <View style={{... styles.square, borderColor: checkboxList[0] ? theme.colors.primary : "lightgray"}}>
                          <BouncyCheckbox
                            disableBuiltInState
                            isChecked = {checkboxList[0]}
                            onPress = {() => setChoice(0)}
                            fillColor={checkboxList[0] ? theme.colors.primary : "lightgray"}
                            ref={(ref: any) => (bouncyCheckboxRefA = ref)}
                          />
                          <Text variant="bodyLarge">{getMyChoice(0)}</Text>
                      </View>
                  </Pressable>
                  <Pressable onPress={() => bouncyCheckboxRefB?.onPress()}>
                      <View style={{... styles.square, borderColor: checkboxList[1] ? theme.colors.primary : "lightgray"}}>
                          <BouncyCheckbox
                            disableBuiltInState
                            isChecked = {checkboxList[1]}
                            onPress = {() => setChoice(1)}
                            fillColor={checkboxList[1] ? theme.colors.primary : "lightgray"}
                            ref={(ref: any) => (bouncyCheckboxRefB = ref)}
                          />
                          <Text variant="bodyLarge">{getMyChoice(1)}</Text>
                      </View>
                  </Pressable>
                  <Pressable onPress={() => bouncyCheckboxRefC?.onPress()}>
                      <View style={{... styles.square, borderColor: checkboxList[2] ? theme.colors.primary : "lightgray"}}>
                          <BouncyCheckbox
                            disableBuiltInState
                            isChecked = {checkboxList[2]}
                            onPress = {() => setChoice(2)}
                            fillColor={checkboxList[2] ? theme.colors.primary : "lightgray"}
                            ref={(ref: any) => (bouncyCheckboxRefC = ref)}
                          />
                          <Text variant="bodyLarge">{getMyChoice(2)}</Text>
                      </View>
                  </Pressable>
                  <Pressable onPress={() => bouncyCheckboxRefD?.onPress()}>
                      <View style={{... styles.square, borderColor: checkboxList[3] ? theme.colors.primary : "lightgray"}}>
                          <BouncyCheckbox
                            disableBuiltInState
                            fillColor={checkboxList[3] ? theme.colors.primary : "lightgray"}
                            isChecked = {checkboxList[3]}
                            onPress = {() => setChoice(3)}
                            ref={(ref: any) => (bouncyCheckboxRefD = ref)}
                          />
                          <Text variant="bodyLarge">{getMyChoice(3)}</Text>
                      </View>
                  </Pressable>
                  <Pressable onPress={() => bouncyCheckboxRefE?.onPress()}>
                      <View style={{... styles.square, borderColor: checkboxList[4] ? theme.colors.primary : "lightgray"}}>
                          <BouncyCheckbox
                            disableBuiltInState
                            isChecked = {checkboxList[4]}
                            onPress = {() => setChoice(4)}
                            fillColor={checkboxList[4] ? theme.colors.primary : "lightgray"}
                            ref={(ref: any) => (bouncyCheckboxRefE = ref)}
                          />
                          <Text variant="bodyLarge">{getMyChoice(4)}</Text>
                      </View>
                  </Pressable>
                  <Pressable onPress={() => bouncyCheckboxRefF?.onPress()}>
                      <View style={{... styles.square, borderColor: checkboxList[5] ? theme.colors.primary : "lightgray"}}>
                          <BouncyCheckbox
                            disableBuiltInState
                            isChecked = {checkboxList[5]}
                            onPress = {() => setChoice(5)}
                            fillColor={checkboxList[5] ? theme.colors.primary : "lightgray"}
                            ref={(ref: any) => (bouncyCheckboxRefF = ref)}
                          />
                          <Text variant="bodyLarge">{getMyChoice(5)}</Text>
                      </View>
                  </Pressable>
                  <Button style={styles.button} mode="contained"
                          onPress = {() =>  buttonPress()}
                  >Continue</Button>
                  </View>
                  {
                    (showError) &&
                    <View>
                        <Text style={{alignSelf: 'center', color:theme.colors.error}}>Error! You must input one or two choices!</Text>
                    </View>
                  }
              </View>
            ) : (

              <View style = {styles.next_page}>
                  <Text style = {styles.header} >
                      You have finished the first part!
                  </Text>
                  <Text variant="headlineMedium" style = {styles.subHeader}>
                      Continue and see your results!
                  </Text>
                  <Button mode="contained" onPress = {() => navigation.navigate('questionnaire_end',{
                      MBTI_res : results_MBTI,
                      Holland_res : results,
                  })}>

                      Continue
                  </Button>
              </View>

            )
          }

      </View>
    );
};



export default Questionnaire_holland;

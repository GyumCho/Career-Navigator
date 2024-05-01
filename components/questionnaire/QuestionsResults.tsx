import React from "react";

import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { MainDrawerProps } from "../../util/nav.ts";
import { DrawerScreenProps } from "@react-navigation/drawer";

const QuestionsResults : React.FC<DrawerScreenProps<MainDrawerProps, 'QuestionsResults'>> = ({navigation, route}) => {
    const theme = useTheme();
    const styles = StyleSheet.create({
      container : {
          flex: 1,
          backgroundColor: theme.colors.primaryContainer,
      },
      personalityView : {
          width: '100%',
          borderRadius: 20,
          padding: 20,
          marginBottom: 20,
      },
      button : {
          marginBottom: 20,
      },

    });
    const MbtiType = route.params.mbtiType;
    const codeOne = route.params.codeOne;
    const codeTwo = route.params.codeTwo;

    const mbtiDesc: {[key: string]: string} = {
        "ISTJ": "Practical, responsible, and detail-oriented individuals who prefer structure and order in their lives.",
        "ISFJ": "Compassionate, loyal, and nurturing individuals who prioritize harmony and helping others.",
        "INFJ": "Insightful, creative, and empathetic individuals who seek meaning and connection in their relationships and work.",
        "INTJ": "Strategic, analytical, and independent thinkers who excel at problem-solving and long-term planning.",
        "ISTP": "Adaptable, logical, and hands-on individuals who enjoy exploring new ideas and experiences.",
        "ISFP": "Artistic, sensitive, and spontaneous individuals who value authenticity and creativity in their lives.",
        "INFP": "Idealistic, compassionate, and introspective individuals who strive for personal growth and authenticity.",
        "INTP": "Logical, curious, and innovative individuals who enjoy exploring complex theories and ideas.",
        "ESTP": "Energetic, action-oriented, and adaptable individuals who thrive in dynamic environments.",
        "ESFP": "Outgoing, spontaneous, and fun-loving individuals who enjoy being the center of attention.",
        "ENFP": "Enthusiastic, creative, and empathetic individuals who are driven by their values and passions.",
        "ENTP": "Inventive, resourceful, and intellectually curious individuals who excel at generating new ideas and solutions.",
        "ESTJ": "Efficient, organized, and practical individuals who value tradition and structure in their work.",
        "ESFJ": "Warm, sociable, and nurturing individuals who prioritize the well-being of others and enjoy creating harmony.",
        "ENFJ": "Charismatic, empathetic, and inspiring individuals who are dedicated to helping others and fostering positive change.",
        "ENTJ": "Assertive, strategic, and visionary leaders who excel at organizing and mobilizing teams towards a common goal.",
    };

    const hollandDesc: {[key: string]: string} = {
        "Realistic" : "People who are practical, hands-on, and enjoy working with tools or machines.",
        "Investigative" : "Individuals who are analytical, curious, and enjoy solving complex problems.",
        "Artistic" : "Those who are creative, imaginative, and enjoy expressing themselves through art or design.",
        "Social" : "People who are empathetic, caring, and enjoy helping others.",
        "Enterprising": "Individuals who are ambitious, persuasive, and enjoy leading or influencing others.",
        "Conventional" : "Those who are organized, detail-oriented, and enjoy working with data or following established procedures.",
    };


    return (
        <View style={styles.container}>
            <View style={{backgroundColor: theme.colors.primaryContainer}}>
                <Text variant="displaySmall" style={{padding: 20, fontWeight: 'bold',color: theme.colors.primary}}>Personality Test Results</Text>
            </View>
            <ScrollView style={{flex: 1, padding: 20, borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: 'white'}}>
            <View style={{...styles.personalityView, backgroundColor: theme.colors.primaryContainer}}>
            <Text variant="bodyLarge" style={{fontWeight: 'bold'}}>{MbtiType !== "" ? MbtiType : "Loading..."}</Text>
            <Text variant="bodyLarge">{MbtiType !== "" ? (mbtiDesc[MbtiType]) : "Loading..."}</Text>
            </View>
            <View style={{...styles.personalityView, backgroundColor: theme.colors.primaryContainer}}>
            <Text variant="bodyLarge" style={{fontWeight: 'bold'}}>{codeOne !== "" ? codeOne : "Loading..."}</Text>
            <Text variant="bodyLarge">{codeOne !== "" ? hollandDesc[codeOne] : "Loading..."}</Text>
            </View>
              {
                codeTwo !== "" ? (<View style={{...styles.personalityView, backgroundColor: theme.colors.primaryContainer}}>
                  <Text variant="bodyLarge" style={{fontWeight: 'bold'}}>{codeTwo !== "" ? codeTwo : "Loading..."}</Text>
                  <Text variant="bodyLarge">{codeTwo !== "" ? hollandDesc[codeTwo] : "Loading..."}</Text>
                </View>) : null
              }
              <Button style={styles.button} mode="outlined" onPress={() => navigation.navigate('GoalMotivationInput', {})}>
                Next
            </Button>
            </ScrollView>
        </View>
    );
};

export default QuestionsResults;

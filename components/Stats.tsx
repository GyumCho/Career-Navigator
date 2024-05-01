import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";

import { PieChart, LineChart, BarChart } from "react-native-gifted-charts";
import { useTheme, Text, Button, Surface, Divider, Icon } from "react-native-paper";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { MainDrawerProps } from "../util/nav.ts";
import { doApiRequest, useApi } from "../util/api.tsx";
import { AccountService } from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Stats: React.FC<DrawerScreenProps<MainDrawerProps, "Stats">> = ({ navigation, route }) => {
  const [num_day, setNum_day] = useState(2);
  const [num, setNum] = useState(10);
  const [num_feedback, setNumFeedback] = useState(10);
  const [num_cities, setNumCities] = useState(4);

  const [userGoals, setUserGoals] = useState({
    shortTerm: "",
    longTerm: "",
    motivations: []
  });

  // const [feedback, setFeedback] = useState([ TODO: Uncomment this and remove the other instance of feedback for backend implementation
  //   {
  //     mentorName: "John Doe",
  //     feedback: "You are a good, hardworking person. But you need to work on your coding skills"
  //   },
  //   {
  //     mentorName: "Jane Doe",
  //     feedback: "You are a nice person"
  //   },
  //   {
  //     mentorName: "William Powell",
  //     feedback: "Work on your communication skills"
  //   },
  //   {
  //     mentorName: "Tim Bosman",
  //     feedback: "Learn to code better"
  //   }
  // ]);

  const [negativeFeedbackCount, setNegativeFeedbackCount] = useState(2);
  const [positiveFeedbackCount, setPositiveFeedbackCount] = useState(9);
  const [int_rate, setIntRate] = useState("25%");
  const [res_time, setResTime] = useState(1);
  const theme = useTheme();
  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.primaryContainer,
      alignItems: "center",
      flex: 1
    },
    top_bar: {
      backgroundColor: "white",
      width: "100%",
      height: "5%",
      flexDirection: "row",
      alignItems: "center",
      marginTop: 10,
      elevation: 10
    },
    menu_img: {
      height: 25,
      width: 25,
      marginLeft: "5%",
      marginRight: "10%"
    },
    user_info: {
      backgroundColor: "white",
      width: "100%",
      height: "25%",
      marginTop: "2%",
      paddingLeft: "5%",
      paddingTop: "2%",
      elevation: 10
    },
    stats_section: {
      backgroundColor: "white",
      width: "100%",
      height: "60%",
      marginTop: "2%",
      elevation: 10,
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      shadowOffset: {
        width: 0,
        height: 2
      }
    },
    pieChart: {
      backgroundColor: "white",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 20,
      width: "100%",
      borderRadius: 8,
      elevation: 5,
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4
    },
    lineChart: {
      backgroundColor: "white",
      paddingVertical: 20,
      paddingHorizontal: 10,
      borderRadius: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
      width: "100%",
      alignSelf: "center",
      marginVertical: 20
    },
    stackedChart: {
      backgroundColor: "white",
      paddingVertical: 20,
      paddingHorizontal: 10,
      borderRadius: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
      width: "100%",
      alignSelf: "center",
      alignItems: "center",
      marginVertical: 20
    },
    sectionContainer: {
      marginVertical: 5,
      marginHorizontal: 10,
      padding: 10,
      backgroundColor: "#ffffff",
      borderRadius: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3
    },
    infoText: {
      fontSize: 18,
      lineHeight: 24,
      color: "#666"
    },
    boldText: {
      fontWeight: "bold"
    },
    emojiText: {
      fontSize: 22
    },
    chartTitle: {
      fontWeight: "bold",
      marginBottom: 10,
      color: "black"
    },
    legendContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "flex-start",
      marginLeft: "5%",
      marginTop: 10
    },
    legendRow: {
      flexDirection: "row",
      justifyContent: "flex-start",
      marginBottom: 10
    },
    legendItem: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: 15
    },
    legendIndicator: {
      height: 12,
      width: 12,
      marginRight: 8,
      borderRadius: 6
    },
    legendText: {
      fontSize: 16,
      color: "#333"
    },
    goalsHeader: {
      fontWeight: "bold",
      color: "#333",
      marginBottom: "2%"
    },
    goalLabel: {
      fontWeight: "bold",
      marginTop: "1%"
    },
    goalText: {
      color: "black",
      marginBottom: 5,
      fontStyle: "italic"
    },
    motivationText: {
      color: "black",
      marginLeft: 10,
      marginBottom: "2%"
    },
    goalView: {
      padding: 20,
      borderRadius: 30,
      marginBottom: 10,
      alignSelf: "stretch"
    }
  });

  // const feedback = [ //TODO: Replace with actual data from the backend
  //   {
  //     mentorName: "John Doe",
  //     feedback: "You are a good, hardworking person. But you need to work on your coding skills"
  //   },
  //   {
  //     mentorName: "Jane Doe",
  //     feedback: "You are a nice person"
  //   },
  //   {
  //     mentorName: "William Powell",
  //     feedback: "Work on your communication skills"
  //   },
  //   {
  //     mentorName: "Tim Bosman",
  //     feedback: "Learn to code better"
  //   }
  // ];

  useEffect(() => {
    loadGoalsAndMotivations();
  }, []);

  const loadGoalsAndMotivations = async () => {
      const username = await AsyncStorage.getItem("username");
      const response = await doApiRequest(AccountService.getUserGoals, username || "");
      setUserGoals({
        shortTerm: response.short_goal || "Error loading short-term goal!",
        longTerm: response.long_goal || "Error loading long-term goal!",
        // @ts-ignore
        motivations: [response.motivation1, response.motivation2, response.motivation3].filter(Boolean)
      });
  };


  const renderLegend = (index: number, text: string, color: string) => {
    return (
      <View key={index} style={{ flexDirection: "row", marginBottom: 12, alignItems: "center" }}>
        <View
          style={{
            height: 12,
            width: 12,
            marginRight: 10,
            borderRadius: 4,
            backgroundColor: color || "white",
            borderWidth: 1,
            borderColor: "white"
          }}
        />
        <Text style={{ color: "black", fontSize: 16, marginRight: "5%" }}>{text}</Text>
      </View>
    );
  };

  const renderBarChartLegend = () => {
    const cities = ["Brooklyn", "California", "Los Angeles", "Africa", "New York", "Chicago"];
    const colors = ["black", "#79D2DE", "#ED6665", "red", "blue", "green"];

    const legendItems = cities.map((city, index) => renderLegend(index, city, colors[index]));

    return (
      <View style={styles.legendContainer}>
        {legendItems}
      </View>
    );
  };

  const [tab, setTab] = useState("0");

  const pieData = [
    { value: 5, color: "#177AD5", text: " 5" },
    { value: 3, color: "#79D2DE", text: " 3" },
    { value: 2, color: "#ED6665", text: " 2" }
  ];
  const lineData = [{ value: 0 }, { value: 1 }, { value: 4 }, { value: 0 }, { value: 2 }, { value: 1 }, { value: 1 }];
  const barData = [{ value: 5, frontColor: "black" }, { value: 3 }, { value: 1, frontColor: "#ED6665" }];

  const InfoLine = ({ emoji, label, value }: any) => (
    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
      <Text style={[styles.emojiText, { marginRight: 6 }]}>{emoji}</Text>
      <Text style={styles.infoText}>
        <Text style={styles.boldText}>{label}</Text> {value}
      </Text>
    </View>
  );


  return (

    <View style={styles.container}>
      <View style={{ width: "100%" }}>
        <Text style={{ padding: 20, color: theme.colors.primary, fontWeight: "bold" }}
              variant="headlineSmall">
          Metrics
        </Text>
      </View>
      <View style={{ backgroundColor: "white", padding: 10, borderTopLeftRadius: 30, borderTopRightRadius: 30 }}>
        <View style={{ width: "100%" }}>
          <ScrollView horizontal style={{ flexDirection: "row" }}>
            <Button mode={tab == "0" ? "contained" : "outlined"} style={{ marginRight: 5 }} onPress={() => {
              setTab("0");
            }}>Goals</Button>
            <Button mode={tab == "1" ? "contained" : "outlined"} style={{ marginRight: 5 }} onPress={() => {
              setTab("1");
            }}>Applications</Button>
            <Button mode={tab == "2" ? "contained" : "outlined"} style={{ marginRight: 5 }} onPress={() => {
              setTab("2");
            }}>Visualize</Button>
          </ScrollView>
        </View>
        {tab == "0" ? (
          <View style={{ flex: 1, alignContent: "center", alignItems: "center", marginTop: 20 }}>

            <Surface style={{ ...styles.goalView, backgroundColor: "#ff9e9e" }}>
              <Text variant="headlineSmall" style={styles.goalLabel}>Short-term Goal:</Text>
              <Text style={styles.goalText}>{userGoals.shortTerm}</Text>
            </Surface>
            <Surface style={{ ...styles.goalView, backgroundColor: "#91aaff" }}>
              <Text variant="headlineSmall" style={styles.goalLabel}>Long-term Goal:</Text>
              <Text style={styles.goalText}>{userGoals.longTerm}</Text>
            </Surface>
            <Surface style={{ ...styles.goalView, backgroundColor: "#8aff9c" }}>
              <Text variant="headlineSmall" style={styles.goalLabel}>Motivations:</Text>
              {userGoals.motivations.map((motivation, index) => (
                <Text key={index} style={styles.motivationText}>- {motivation}</Text>
              ))}
            </Surface>
          </View>
        ) : (tab == "1") ? (

          <View style={{ height: "100%", alignItems: "center", marginTop: 20 }}>
            <View style={styles.sectionContainer}>
              <InfoLine emoji="📝" label="Total Jobs applied for:" value={num} />
              <InfoLine emoji="⏳" label="Days since last application:" value={num_day} />
              <InfoLine emoji="👩‍💼" label="Feedback from employers:" value={num_feedback} />
              <InfoLine emoji="🎯" label="Interview rate:" value={int_rate} />
              <InfoLine emoji="📅" label="Response Time (days): " value={res_time} />
              <InfoLine emoji="👍" label="Positive Feedback:" value={positiveFeedbackCount} />
              <InfoLine emoji="👎" label="Negative Feedback:" value={negativeFeedbackCount} />

            </View>
          </View>
        ) : (tab == "2") ? (
            <ScrollView style={{ height: "100%", backgroundColor: "white", marginTop: 20 }}>
              <View style={styles.pieChart}>
                <Text style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  marginTop: 5,
                  marginBottom: 5,
                  textDecorationStyle: "double",
                  color: "black"
                }}>
                  Types of stages reached
                </Text>
                <View style={{ flexDirection: "row", marginBottom: 20, alignItems: "center" }}>
                  <PieChart
                    textColor="black"
                    radius={100}
                    textSize={18}
                    showTextBackground
                    textBackgroundRadius={15}
                    strokeColor="white"
                    strokeWidth={2}
                    showText
                    donut
                    data={pieData}
                    centerLabelComponent={() => {
                      return (
                        <View>
                          <Text style={{ color: "black", fontWeight: "bold", fontSize: 30 }}>{num}</Text>
                          <Text style={{ color: "black", fontWeight: "bold", fontSize: 16 }}>Total</Text>
                        </View>
                      );
                    }}
                  />
                  <View style={{ marginTop: 10, marginLeft: 10, justifyContent: "space-evenly" }}>
                    {renderLegend(0, "Sent Resume", "#177AD5")}
                    {renderLegend(1, "Interviewed", "#79D2DE")}
                    {renderLegend(2, "Exam", "#ED6665")}
                  </View>
                </View>

              </View>

              <Divider />

              <View style={styles.lineChart}>
                <Text style={styles.chartTitle}>
                  Applications sent over time (per week)
                </Text>
                <LineChart
                  areaChart
                  data={lineData}
                  startFillColor={theme.colors.primary}
                  startOpacity={0.8}
                  thickness={5}
                  endFillColor="#CBC3E3"
                  endOpacity={0.1}
                  initialSpacing={0}
                  spacing={50}
                  focusEnabled
                  hideDataPoints
                  showVerticalLines
                  verticalLinesColor="rgba(0,0,0,0.2)"
                />
              </View>

              <Divider />

              <View style={styles.stackedChart}>
                <Text style={styles.chartTitle}>
                  Cities that you've applied to
                </Text>
                <BarChart
                  frontColor={theme.colors.primary} // Primary accent color for bars
                  barWidth={75}
                  data={barData}
                  noOfSections={10}
                  disablePress
                />
                {renderBarChartLegend()}
              </View>
            </ScrollView>


          ) :
          (
            <ScrollView style={{ height: "100%", marginTop: 20 }} contentContainerStyle={{alignItems: "center", margin: 20}}>
                {/*{*/}
                {/*  feedback.map((item, index) => (*/}
                {/*    <View key={index} style={{...styles.sectionContainer, flex: 1, flexDirection: 'column'}}>*/}
                {/*      <Text style={styles.infoText}>*/}
                {/*        <Text style={styles.boldText}>{item.mentorName}</Text> says: {item.feedback}*/}
                {/*      </Text>*/}
                {/*    </View>*/}
                {/*  ))*/}
                {/*}*/}
            </ScrollView>
          )
        }
      </View>
    </View>

  );
};


export default Stats;

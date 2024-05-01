import React from "react";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { View } from "react-native";
import { useTheme } from "react-native-paper";
import { useAuthState } from "../../context/authcontext";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const CustomDrawer = ({ props }: any) => {
  const theme = useTheme();

  // alternative: pass as argumenINITIAL_AUTH_STATEt...
  const { isMentor } = useAuthState();


  return <View style={{ flex: 1 }}>
    <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: theme.colors.primary }}>
      <View style={{ padding: 80 }} />
      <View style={{ backgroundColor: "white" }}>
        {isMentor ? (
          <View>
            <DrawerItem {...props}
                        label="Home"
                        onPress={() => props.navigation.navigate("Home")}
                        icon={({ focused, color, size }) => <Icon color={color} size={size} name={focused ? 'home' : 'home-outline'} /> }
            />
            <DrawerItem {...props}
                        label="Your Profile"
                        onPress={() => props.navigation.navigate("Profile")}
                        icon={({ color, size }) => <Icon color={color} size={size} name={'account-outline'} /> }
            />
            <DrawerItem {...props}
                        label="Post new Job"
                        onPress={() => props.navigation.navigate("JobPosting")}
                        icon={({ color, size }) => <Icon color={color} size={size} name={'pencil-plus'} /> }
            />
            <DrawerItem {...props}
                        label="Your Students"
                        onPress={() => props.navigation.navigate("MentorStudents")}
                        icon={({ color, size }) => <Icon color={color} size={size} name={'account-group'} /> }
                        />


            <DrawerItem {...props}
                        label="Mentor Requests"
                        onPress={() => props.navigation.navigate("MentorMatching")}
                        icon={({ color, size }) => <Icon color={color} size={size} name={'account-supervisor-outline'} /> }
            />
            <DrawerItem {...props}
                        label="Forum"
                        onPress={() => props.navigation.navigate("Forum")}
                        icon={({ color, size }) => <Icon color={color} size={size} name={'forum'} /> }
                        />
            <DrawerItem {...props}
                        label="Post Tips and Tricks"
                        onPress={() => props.navigation.navigate("PostTips")}
                        icon={({ color, size }) => <Icon color={color} size={size} name={'tooltip-plus'} /> }/>
          </View>
        ) : (
          <View>
            <DrawerItem {... props}
                        label="Home"
                        onPress={() => props.navigation.navigate("Home")}
                        icon={({ focused, color, size }) => <Icon color={color} size={size} name={focused ? 'home' : 'home-outline'} /> }
            />
            <DrawerItem {...props}
                        label="Your Profile"
                        onPress={() => props.navigation.navigate("Profile")}
                        icon={({ color, size }) => <Icon color={color} size={size} name={'account-outline'} /> }
            />
            <DrawerItem {...props}
                        label="Jobs"
                        onPress={() => props.navigation.navigate("JobList")}
                        icon={({ color, size }) => <Icon color={color} size={size} name={'archive-search-outline'} /> }
            />
            <DrawerItem {...props}
                        label="Create/Upload Resume"
                        onPress={() => props.navigation.navigate("Resume")}
                        icon={({ color, size }) => <Icon color={color} size={size} name={'file-account'} /> }
            />
            {/*<DrawerItem {...props}*/}
            {/*            label="Questions"*/}
            {/*            onPress={() => props.navigation.navigate("questionnaire_intro")}*/}
            {/*            icon={({ color, size }) => <Icon color={color} size={size} name={'halloween'} /> }*/}
            {/*/>*/}
            <DrawerItem {...props}
                        label="Applications"
                        onPress={() => props.navigation.navigate("ApplicationProcess")}
                        icon={({ color, size }) => <Icon color={color} size={size} name={'tie'} /> }
            />
            <DrawerItem {...props}
                        label="Forum"
                        onPress={() => props.navigation.navigate("Forum")}
                        icon={({ color, size }) => <Icon color={color} size={size} name={'forum'} /> }
                        />

            <DrawerItem {...props}
                        label="Metrics"
                        onPress={() => props.navigation.navigate("Stats")}
                        icon={({ color, size }) => <Icon color={color} size={size} name={'chart-bar'} /> }
                        />

            <DrawerItem {...props}
                        label="My Mentor"
                        onPress={() => props.navigation.navigate("ViewMentor")}
                        icon={({ color, size }) => <Icon color={color} size={size} name={'handshake'} /> }
                        />
            <DrawerItem {...props}
                        label="View Tips and Tricks"
                        onPress={() => props.navigation.navigate("PostTips")}
                        icon={({ color, size }) => <Icon color={color} size={size} name={'lightbulb-on'} /> }
                        />

          </View>)}
      </View>
    </DrawerContentScrollView>
  </View>;
};

export default CustomDrawer;

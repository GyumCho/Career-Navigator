import React, { useEffect, useState } from 'react';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import {StyleSheet, View, Pressable, Image, ScrollView} from "react-native";
import { useTheme, Text, Chip, Button} from 'react-native-paper';


interface ApplicationProcessProps {
  position: string;
  organization: string;
  location: string;
  applied_date: string;
  image: string;
  keywords: string;
  sent: boolean,
  processed: boolean,
  interviewed: boolean,
  feedback?: string;
  closeModal: () => void;
}

const ApplicationProcess: React.FC<ApplicationProcessProps> = ({ position, organization, location,applied_date, image,keywords,sent,processed,interviewed, closeModal, feedback}) => {
  const [view, setView] = useState<Element[]>([]);
  const [infoPressed, setInfoPressed] = useState(false);

  const onMoreInfo = () => {
    // This function does not do anything since it was not implemented in the backend
    return;
  };

  const theme = useTheme();
  useEffect(() => {
    const temp_view: Element[] = [];
    const num_view = 4;

    const stages =  {
      1 : ['Send your resume', sent,sent],
      2 : ['Processing your resume', processed ,processed],
      3 : ['Test', false, false],
      4 : ['Interview', interviewed ,interviewed]
    }

    for (let i = 0; i < num_view; i++) {
      let state = stages[i + 1][1];

      temp_view.push(
        <View key={i} style = {styles.step}>
          <BouncyCheckbox
            disableBuiltInState
            isChecked={state}
            ref={(ref: any) => (bouncyCheckboxRef = ref)}
            fillColor={theme.colors.primary}
            unfillColor="lightgray"
          />
          <Text>{stages[i + 1][0]}</Text>
          <Chip mode="flat" onPress = {() => onMoreInfo()}>
            <Text>More Info</Text>
          </Chip>
        </View>
      );
    }
    setView(temp_view);
  },[setView]);

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'column', // inner items will be added vertically
      flexGrow: 1,            // all the available vertical space will be occupied by it
      justifyContent: 'space-between',
      backgroundColor: '#A9A9A9'
    },
    body : {
          flex:1,
          padding: 10,
    },
    footer : {
        height:80,
        backgroundColor: 'white'
    },
    company_section : {
      backgroundColor : 'white',
      margin: 10,
      borderRadius: 30,
      alignSelf: 'stretch',
      marginTop : '2%',
      padding: 20,
      elevation : 10,
    },
    step_section : {
      flex: 1,
      justifyContent: 'flex-end',
      padding: 10,
      backgroundColor : 'white',
      width : '100%',
      marginTop : 10,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      alignItems : 'center',
      elevation : 10,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      shadowOffset: {
        width: 0,
        height: 2,
      },
    },
    step : {
      width : '100%',
      backgroundColor : theme.colors.primaryContainer,
      marginTop : 10,
      minHeight: 70,
      borderRadius : 30,
      flexDirection : 'row',
      alignItems : 'center',
      alignContent: 'center',
      justifyContent : 'space-between',
      padding: 15,
      elevation : 3,
      shadowColor: '#000',
      shadowOpacity: 0.8,
      shadowRadius: 1.41,
    },
    button_info : {
      height : '80%',
      width : '25%',
      backgroundColor : 'white',
      alignItems : 'center',
      justifyContent : 'center',
      borderRadius: 4,
      elevation : 3,
    },
  });

  return (
    <View style = {styles.container}>
        <View style={styles.body}>
          <ScrollView style={{flex: 1, backgroundColor: 'white', borderRadius: 30, paddingVertical: 20, paddingHorizontal: 10}}>
          <Text variant="headlineSmall" style={{textAlign:'left', margin:10,marginTop:0 , fontWeight: 'bold'}}>Application for {position}</Text>
          <View style={{flexDirection: 'row'}}>
            <Image
              source = {{uri: image}}
              style = {{height : 75, width : 75 }}
            />
            <View style = {{flexDirection : 'column'}}>
              <Text variant="bodyLarge">{organization}</Text>
              <Text variant="bodyLarge">{location}</Text>
              <Text variant="bodyLarge">{`Applied on ${formatDate(applied_date)}`}</Text>
            </View>
          </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: '1.5%' }}>
              {
                keywords.split(",").map((skill, index) => (
                  <Chip key={index} style={{ marginRight: 5, marginBottom: 20 }} mode="outlined">{skill}</Chip>
                ))
              }
            </View>
          </ScrollView>
      </View>
      <ScrollView style={{flex: 1, paddingHorizontal: 10, backgroundColor:'white', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingBottom: 50}}>
          <Text variant="titleLarge" style={{padding:10, fontWeight: 'bold'}}>Application progress</Text>
          {view}
        {
          feedback && (
            <View style={{...styles.step, backgroundColor: theme.colors.primaryContainer, flexDirection: 'column', padding: 0}}>
              <Text style={styles.body} variant={'titleMedium'}>Feedback</Text>
              <Text style={styles.body} variant={'bodyMedium'}>{feedback}</Text>
            </View>
          )
        }
      </ScrollView>
      <View style={styles.footer}>
          <Button onPress={closeModal} mode={'outlined'} style={{margin: 20}}>
            <Text>Close</Text>
          </Button>
      </View>
      {/*{*/}
      {/*  infoPressed &&*/}
      {/*  <Pressable style = {styles.more_info} onPress = {() => onMoreInfo()}>*/}
      {/*    <Text style = {styles.TextHeader}>{info_Title === " " ? "Loading..." : info_Title}</Text>*/}
      {/*    <View style={styles.horizontalLine}/>*/}
      {/*    <Text style = {styles.TextSubHeader}> {info_paragraph === " " ? "Loading..." : info_paragraph}</Text>*/}
      {/*    <View style={styles.horizontalLine}/>*/}
      {/*  </Pressable>*/}
      {/*}*/}
    </View>
  );
};



export default ApplicationProcess;

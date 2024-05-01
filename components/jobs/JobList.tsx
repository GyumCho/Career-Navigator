import React from 'react';
import { View,
        Text,
        StyleSheet,
        TouchableHighlight,
        FlatList} from "react-native";
import { useEffect, useState } from "react";
import JobItem from "./JobItem";
import { BookmarkService, Job, JobService, NinjaPaginationResponseSchema_Job_ } from "../../api";
import {Searchbar, useTheme } from "react-native-paper";
import { doApiRequest } from '../../util/api';
import { DrawerScreenProps } from "@react-navigation/drawer";
import { MainDrawerProps } from "../../util/nav.ts";

const JobList : React.FC<DrawerScreenProps<MainDrawerProps, 'JobList'>> = ({navigation}) => {
  const theme = useTheme();
  const styles = StyleSheet.create({
    container : {
      backgroundColor: theme.colors.background,
      flex: 1,
    },
    subtitle : {
      fontSize: 20,
      color: 'black',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.onPrimary,
      margin: 10,
      marginBottom: 20,
    },
    searchbar: {
      flexDirection: 'row',
    },
    icon : {
      padding: 10,
    },
    head : {
      backgroundColor : theme.colors.primary,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      padding: 10,
      paddingBottom: 30,
      marginBottom: 20,
      elevation: 3,
      shadowOffset: {
        width: 1,
        height: 1,
    },
    },
    body : {
      marginHorizontal: 20,
      flex: 1,
    },
    tabs : {
      flexDirection : "row",
    },
    tabHeaderActive : {
      fontSize: 18,
      color : 'black'
    },
    tabHeaderInActive : {
      fontSize: 18,
      color : 'grey'
    },
    tabActive : {
      borderBottomColor: theme.colors.primary,
      borderBottomWidth: 5,
      paddingBottom: 5,
      alignItems: 'center',
      marginBottom: 10,
      marginRight:15
    },
    tabInActive : {
      paddingBottom: 5,
      marginRight:15
    },
    notFound : {
      padding: 10,
    },
    searchBar : {
      marginHorizontal: 10,
    },
  });
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchText, setSearchText] = useState('');
  const [tab, setTab] = useState(0);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    navigation.addListener('focus', () => {
      setTab(0);
      fetchRecommended();
    });
  }, [navigation]);

  const fetchData = async (search : string) => {
    // fetch data
    var jobs = await doApiRequest(JobService.searchJobs, search);
    var favs = await doApiRequest(BookmarkService.getBookmarks);
    setData(favs, jobs);
  };


  const fetchFavorites = async () => {
    console.log("fetching bookmarks");
    var bookmarks = (await doApiRequest(BookmarkService.getBookmarks)).items;
    bookmarks.forEach((item) => {
      item.fav = true;
     });
    setJobs(bookmarks);
  };

  const fetchRecommended = async () => {
        // fetch data
        try {
          var jobs = await doApiRequest(JobService.recommended);
          var favs = await doApiRequest(BookmarkService.getBookmarks);
          setData(favs, jobs);
        } catch (error) {
          // set jobs to empty array
          setJobs([]);
          setShowText(true);
        }
  }

  const onSubmitted = async () => {
    setTab(2);
    fetchData(searchText);
  };

  const setData = (favs:NinjaPaginationResponseSchema_Job_, jobs : Job[]) => {
    // convert bookmarks to dict
    var fdict: {[key: number]: boolean} = {};
    favs.items.forEach((item) => {
      fdict[item.id || 0] = true;
     });
    // ui update
    if (jobs.length === 0) {
      setShowText(true);
    } else {
      setShowText(false);
    }
    //set favorites
    jobs.forEach((item) => {
      item.fav = fdict[item.id || 0] !== undefined;
     });
    setJobs(jobs);
  }

  const changeBookmark = async (job: Job) => {
    if (job.fav) {
      // delete bookmark
      console.log("delete bookmark", job.id)
      await doApiRequest(BookmarkService.deleteBookmark, job.id || 0); //TODO: check if succesfull
      if (tab === 1){
        // delete bookmark from state array
        setJobs(oldValues => {
          return oldValues.filter(item => item.id !== job.id);
        });
      } else {
        setJobs(jobs.map(j =>
          j.id === job.id ? { ...j, fav: false } : j
        ));
      }
    } else {
      console.log("bookmark", job.id);
      const result = await doApiRequest(BookmarkService.bookmarkJob, job.id || 0)
      console.log(result)
      if(result) {
        // update bookmark state array
        setJobs(jobs.map(j =>
          j.id === job.id ? { ...j, fav: true } : j
        ));
    }
    }
  };

  return <View style={styles.container}>
    <View style={styles.head}>
      <Text style={styles.title}>Find The Best Job{'\n'} For You!</Text>
      <Searchbar style={styles.searchBar}
        placeholder="Search here..."
        onChangeText={setSearchText}
        value={searchText}
        onSubmitEditing={async () => await onSubmitted()} />
    </View>
    <View style={styles.body}>
      <View style={styles.tabs}>
      <TouchableHighlight onPress={()=>{fetchRecommended(); setTab(0);}}>
          <View style={tab === 0 ? styles.tabActive : styles.tabInActive}>
            <Text style={tab === 0 ? styles.tabHeaderActive : styles.tabHeaderInActive}>Recommended</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight onPress={()=>{fetchData(""); setTab(2);}}>
          <View style={tab === 2 ? styles.tabActive : styles.tabInActive}>
            <Text style={tab === 2 ? styles.tabHeaderActive : styles.tabHeaderInActive}>All</Text>
          </View>
        </TouchableHighlight>

        <TouchableHighlight onPress={()=>{fetchFavorites(); setTab(1);}}>
          <View style={tab === 1 ? styles.tabActive : styles.tabInActive}>
            <Text style={tab === 1 ? styles.tabHeaderActive : styles.tabHeaderInActive}>Bookmarks</Text>
          </View>
        </TouchableHighlight>
      </View>
      { showText && <View style={styles.notFound}><Text>No items found</Text></View>}
      <FlatList data={jobs} style={{flex: 1}} renderItem={({item}) =>
        <TouchableHighlight onPress={() => navigation.navigate('JobDetails', {'job':item})}>
            <JobItem
              onPress={() => changeBookmark(item)}
              job={item}/>
          </TouchableHighlight>}
        scrollEnabled={true}/>


    </View>
  </View>;
};

export default JobList;

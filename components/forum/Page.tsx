import React, { useCallback, useEffect, useState } from "react";
import { ErrorView, hoistRequestStates, useApi, useApiImmediate } from "../../util/api.tsx";
import { CommentListEntrySchema, ForumCommentService, ForumPageService } from "../../api";
import {
  ActivityIndicator,
  BackHandler,
  FlatList, ScaledSize, ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { ForumStackParamList } from "./index.tsx";
import RenderHTML from "react-native-render-html";
import { Button, Divider, IconButton, useTheme, Text } from "react-native-paper";
import { MainDrawerContext } from "../../util/nav.ts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack/src/types.tsx";
import { Userpic } from "react-native-userpic";

export type PageProps = StackScreenProps<ForumStackParamList, "page">;

export const CommentLine: React.FC<{
  comment: CommentListEntrySchema,
  categoryId: number,
  pageId: number,
  dimensions: ScaledSize,
  index: number,
  navigation: PageProps["navigation"],
  myUsername: string,
  length: number
}> =
  ({ comment, categoryId, pageId, dimensions, index, length, myUsername }) => {
    const [html, refreshHtml] = useApi(ForumCommentService.commentHtml);
    useEffect(() => {
      (async () => {
        await refreshHtml(categoryId, pageId, comment.id as number);
      })().catch(console.error);
    }, [refreshHtml, categoryId, pageId, comment]);
    const nav = useNavigation<StackNavigationProp<ForumStackParamList, "page">>();
    const theme = useTheme();


    if (html.state === "initial" || html.state === "fetching") {
      return <ActivityIndicator size={"large"} />;
    } else if (html.state === "error") {
      return <ErrorView error={html.error} />;
    }

    const posted_at = new Date(comment.created_at);
    const styles = StyleSheet.create({
      text: {
        color: theme.colors.secondary,
      },
      item: {
        //borderTopWidth: 1,
        borderTopColor: theme.colors.outline,
      },
      lastItem: {
        //borderBottomWidth: 1,
        borderBottomColor: theme.colors.outline,
      },
      commentsText: {
        alignSelf: "flex-end",
        flex: 1,
        color: theme.colors.secondary,
      },
      postedAt: {
        alignSelf: "flex-start",
        flex: 3,
        color: theme.colors.secondary,
      },
      userPic: {
        alignSelf: "flex-end",
        bottom: -3,
        marginRight: 5,
      },
      subTitle: {
        fontSize: 12,
        fontWeight: "bold",
        color: theme.colors.secondary,
        paddingLeft: 20,
        marginBottom: 5,
      },
    });

    return <View style={(index < length - 1)
      ? styles.item
      : { ...styles.item, ...styles.lastItem }}>
      <View style={{height:10}}>
            <Divider bold={true}/>
          </View>
      <View style={{flex: 1,flexDirection: "row"}}>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: 20}}>
          <View>
            <Userpic size={30} style={styles.userPic} email={comment.owner.email || undefined} />
          </View>
          <View style={{flex: 1,backgroundColor: 'white'}}>
            <View style={{flex: 1,flexDirection: 'row'}}>
              {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
              <Text style={styles.subTitle}>{comment.owner.first_name} {comment.owner.last_name} </Text>
              <Text style={{...styles.subTitle, flex:1,textAlign:'right', color:'gray'}}>Posted on {posted_at.toDateString()}</Text>
            </View>
            <View style={{flex: 1, marginLeft: 20, flexDirection:'row'}}>
              <RenderHTML source={{ html: html.response }} baseStyle={styles.text} contentWidth={dimensions.width} />
              {myUsername === comment.owner.username
          ? <View style={{flex:1,justifyContent:'flex-end'}}><IconButton
            icon="pencil"
            mode="contained"
            style={{alignSelf:'flex-end'}}
            iconColor={theme.colors.primary}
            onPress={() => {
              nav.navigate("editComment", {
                categoryId, pageId, comment,
              });
            }}
          /></View>
          : null}
            </View>

          </View>
        </View>
      </View>
    </View>;
  };

export const Page: React.FC<PageProps> = ({ navigation, route }) => {
  const [commentsState, refreshComments] = useApiImmediate(ForumCommentService.commentList,
    route.params.categoryId, route.params.pageId);
  const [htmlState, refreshHtml] = useApiImmediate(ForumPageService.pageHtml,
    route.params.categoryId, route.params.pageId);
  const [pageState, refreshPage] = useApiImmediate(ForumPageService.pageDetail,
    route.params.categoryId, route.params.pageId);
  const dimensions = useWindowDimensions();
  const Drawer = React.useContext(MainDrawerContext);
  const [myUsername, setMyUsername] = useState<string | undefined>();
  useEffect(() => {
    const backAction = () => {
      //@ts-ignore
      navigation.navigate('index');
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [navigation]);

  const theme = useTheme();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white",
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.primary,
      paddingHorizontal: 20,
    },
    subTitle: {
      fontSize: 12,
      fontWeight: "bold",
      color: theme.colors.secondary,
      paddingHorizontal: 20,
      marginBottom: 5,
    },
    userPic: {
      alignSelf: "center",
      bottom: -3,
      marginRight: 5
    },
  });

  useEffect(() => {
    (async () => {
      const username = await AsyncStorage.getItem("username");
      if (username) {
        setMyUsername(username);
      }
    })().catch(_ => {
    });
  }, []);

  const rs = hoistRequestStates(commentsState, htmlState, pageState);

  useFocusEffect(useCallback(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    if (!Drawer) {
      console.log("Could not register refresh button");
      return;
    }

    Drawer.setOptions({
      headerRight: () => (
        <IconButton icon="refresh" onPress={() => {
          refreshPage();
          refreshHtml();
          refreshComments();
        }} />
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Drawer, refreshPage, refreshHtml, refreshComments, navigation]));

  if (rs.state === "fetching") {
    return <View style={styles.container}>
      <ActivityIndicator size={"large"} />
    </View>;
  } else if (rs.state === "error") {
    return <ErrorView error={rs.error} />;
  }

  const [comments, html, page] = rs.response;

  const postedAt = new Date(page.created_at);

  return <View style={styles.container}>
    <ScrollView>

      <View style={{padding: 20,flex: 1, justifyContent: 'flex-start'}}>
        <View style={{flex: 0,flexDirection: 'row', alignItems:'center'}}>
          <Userpic size={30} style={styles.userPic} email={page.owner.email || undefined} />
          {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
          <Text style={styles.subTitle}>{page.owner.first_name} {page.owner.last_name} </Text>
          <View style={{flex:1}}>
            <Text style={{...styles.subTitle, color:'gray', alignSelf:'flex-end'}}>Posted on {postedAt.toDateString()}</Text>
          </View>
        </View>
        <View style={{flex:1, marginTop:10}}>
          <Text style={{ ...styles.title, flex: 1,alignSelf:'flex-start'}}>{page.title}</Text>
        <View style={{flex: 1, marginLeft: 20}}>
          <RenderHTML baseStyle={{ color: theme.colors.secondary, paddingHorizontal: 0}} contentWidth={dimensions.width}
                source={{ html }} />
          {myUsername === page.owner.username &&
            <View style={{flex: 0}}>
              <Button
                mode="contained"
                icon="pencil"
                onPress={() => {
                  navigation.navigate("editPage", {
                    page: page,
                    categoryId: page.category,
                  });
                }}
                style={{width:100 , alignSelf:'flex-end',backgroundColor: theme.colors.primary }}>
                  Edit
              </Button>
            </View>}
          </View>
        </View>
      </View>
      <FlatList
        scrollEnabled={false}
        style={styles.container}
        data={comments.items}
        renderItem={({ item, index }) => {
          return <CommentLine
            myUsername={myUsername || ""}
            comment={item}
            categoryId={route.params.categoryId}
            pageId={route.params.pageId}
            dimensions={dimensions}
            navigation={navigation}
            index={index}
            length={comments.items.length} />;
        }} />
    </ScrollView>
    <Button
      mode="contained"
      icon="comment"
      contentStyle={{ flexDirection: "row" }}
      style={{ backgroundColor: theme.colors.primary, margin: 10 }}
      onPress={() => navigation.navigate("editComment", { pageId: page.id as number, categoryId: page.category })}
    >
      Reply to post
    </Button>
  </View>;
};


import React, { useCallback, useEffect } from "react";
import { ErrorView, useApiImmediate } from "../../util/api.tsx";
import { ForumPageService, PageListEntryScema } from "../../api";
import { ActivityIndicator, BackHandler, FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { ForumStackParamList } from "./index.tsx";
import { Userpic } from "react-native-userpic";
import { Button, IconButton, useTheme, Text, Chip } from "react-native-paper";
import { MainDrawerContext } from "../../util/nav.ts";
import { useFocusEffect } from "@react-navigation/native";

export type CategoryProps = StackScreenProps<ForumStackParamList, 'category'>;

export const PageLine: React.FC<{page: PageListEntryScema, category: number, index: number, navigation: CategoryProps['navigation'], length: number}> =
    ({page, index, category, navigation, length}) => {
  const postedAt = new Date(page.created_at);
  const theme = useTheme();
      const styles = StyleSheet.create({
        text: {
          color: theme.colors.primary,
        },
        item: {
          paddingLeft: 20,
          paddingTop: 7,
          paddingRight: 20,
          height: 64,
          marginVertical: 0,
          marginHorizontal: 16,
          borderTopWidth: 1,
          borderTopColor: '#444',
        },
        lastItem: {
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.outline,
        },
        userPic: {
          bottom: -3,
        },
        commentsText: {
          alignSelf: "flex-end",
          flex: 1,
          color: theme.colors.backdrop,
        },
        postedAt: {
          alignSelf: "flex-start",
          flex: 3,
          color: theme.colors.backdrop,
        },
      });


  return <TouchableOpacity
    style={(index < length - 1)
      ? styles.item
      : {...styles.item, ...styles.lastItem}}
    key={page.id}
    onPress={() => navigation.navigate('page', {categoryId: category, pageId: page.id as number})}>
    <Text style={styles.text}><Userpic size={18} style={styles.userPic} email={page.owner.email || undefined} /> {page.title}</Text>
    <View style={{flexDirection: "row"}}>
      <Text style={{...styles.text, ...styles.postedAt}}>Posted at {postedAt.toDateString()}</Text>
      <Text style={{...styles.text, ...styles.commentsText}}>{page.num_comments} comments</Text>
    </View>
  </TouchableOpacity>;
};

export const Category: React.FC<CategoryProps> = ({navigation, route}) => {
  const [pages, refreshPages] = useApiImmediate(ForumPageService.pageList, route.params.categoryId);
  const Drawer = React.useContext(MainDrawerContext);
  const theme = useTheme();
  useEffect(() => {
    const backAction = () => {
      //@ts-ignore
      navigation.navigate('index');
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [navigation]);

  useFocusEffect(useCallback(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    if (!Drawer) {
      return;
    }

    Drawer.setOptions({
      headerRight: () => (
        <IconButton icon="refresh" onPress={() => {
          refreshPages();
        }} />
      ),
    });
  }, [Drawer, refreshPages, navigation]));

  if (pages.state === 'initial' || pages.state === 'fetching') {
    return <View style={{ flex: 1, backgroundColor: "white" }}>
      <ActivityIndicator size={'large'} />
    </View>;
  } else if (pages.state === "error") {
    return <ErrorView error={pages.error} />;
  }

  return <View style={{ flex: 1, backgroundColor: "white"}}>
    <FlatList
      data={pages.response.items}
      renderItem={({item, index}) =>
        <PageLine page={item} navigation={navigation} category={route.params.categoryId} index={index} length={pages.response.items.length} />
      } />
    <Button
      mode="contained"
      icon="comment"
      dark={true}
      contentStyle={{flexDirection: 'row'}}
      style={{backgroundColor: theme.colors.primary, margin: 10}}
      onPress={() => navigation.navigate('editPage', { categoryId: route.params.categoryId as number })}
    >
      Add Page
    </Button>
  </View>;
};




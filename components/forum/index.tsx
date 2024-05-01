import {
  ActivityIndicator,
  BackHandler,
  FlatList, ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect } from "react";
import { ErrorView, useApiImmediate } from "../../util/api.tsx";
import { CommentListEntrySchema, ForumCategoryService, PageListEntryScema } from "../../api";
import { IconButton, Text } from 'react-native-paper';
import { createStackNavigator, StackScreenProps } from "@react-navigation/stack";
import { Category } from "./Category.tsx";
import { Page } from "./Page.tsx";
import { EditComment } from "./EditComment.tsx";
import { EditPage } from "./EditPage.tsx";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { MainDrawerContext, MainDrawerProps } from "../../util/nav.ts";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {useTheme}  from "react-native-paper";

type ForumIndexProps = StackScreenProps<ForumStackParamList, 'index'>;

export const ForumIndex: React.FC<ForumIndexProps> = ({navigation}) => {
  const [categories, refreshCategories] = useApiImmediate(ForumCategoryService.categoryList);
  const Drawer = React.useContext(MainDrawerContext);
  const theme = useTheme();

  useEffect(() => {
    const backAction = () => {
      //@ts-ignore
      navigation.navigate('Home');
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [navigation]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white",
    },
    item: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.backdrop,
      padding: 20,
      marginVertical: 0,
      marginHorizontal: 16,
    },
    lastItem: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.backdrop,
    },
    text: {
      color: theme.colors.primary,
    },
  });

  useFocusEffect(useCallback(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    if (!Drawer) {
      return;
    }

    Drawer.setOptions({
      headerRight: () => (
        <IconButton icon="refresh" onPress={() => {
          refreshCategories();
        }} />
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Drawer, refreshCategories, navigation]));

  if (categories.state === 'initial' || categories.state === 'fetching') {
    return <ScrollView style={styles.container}>
      <ActivityIndicator size={'large'} />
    </ScrollView>;
  } else if (categories.state === 'error') {
    return <ErrorView error={categories.error} />;
  }

  return <View style={{flex: 1, backgroundColor: 'white'}}>
    <Text variant="titleLarge" style={{padding: 20}}>Topics</Text>
    <FlatList
    style={styles.container}
    data={categories.response.items}
    renderItem={({item, index}) =>
      <TouchableOpacity
          style={(index < categories.response.items.length - 1)
            ? styles.item
            : {...styles.item, ...styles.lastItem}}
          key={item.id}
          onPress={() => navigation.navigate('category', {categoryId: item.id as number})}>
        <Text style={styles.text}>{item.name}</Text>
      </TouchableOpacity>} />
  </View>;
};

export type ForumStackParamList = {
  index: {},
  category: {
    categoryId: number,
  },
  page: {
    categoryId: number,
    pageId: number,
  },
  editPage: {
    categoryId: number,
    page?: PageListEntryScema,
  },
  editComment: {
    categoryId: number,
    pageId: number,
    comment?: CommentListEntrySchema,
  },
}

const ForumStack =  createStackNavigator<ForumStackParamList>();

export const ForumStackNavigator = () => {
  const navigation = useNavigation<DrawerNavigationProp<MainDrawerProps>>();

  return <MainDrawerContext.Provider value={navigation}>
    <ForumStack.Navigator initialRouteName={'index'} screenOptions={{
      headerShown: false,
    }}>
      <ForumStack.Screen name={'index'} component={ForumIndex} />
      <ForumStack.Screen name={'category'} component={Category} />
      <ForumStack.Screen name={'page'} component={Page} />
      <ForumStack.Screen name={'editComment'} component={EditComment} />
      <ForumStack.Screen name={'editPage'} component={EditPage} />
    </ForumStack.Navigator>
  </MainDrawerContext.Provider>;
};

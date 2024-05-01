import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import RenderHTML from "react-native-render-html";
import { useApi } from "../../util/api.tsx";
import { MarkdownService } from "../../api";
import { useDebounce } from "@uidotdev/usehooks";
import { Button, useTheme } from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";

export type Props = {
  initialText?: string,
  saveIcon: IconSource,
  saveText: string,
} & ({
  onSave: (text: string, title: string) => void,
  editTitle: true,
  initialTitle?: string,
} | {
  onSave: (text: string) => void,
});

export const Editor: React.FC<Props> = (props) => {
  const [markdown, setMarkdown] = useState(props.initialText || "");
  const [previousHtml, setPreviousHtml] = useState<string>("");
  const [title, setTitle] = useState(('editTitle' in props) ? (props.initialTitle || "") : "");
  const debouncedMarkdown = useDebounce(markdown, 200);
  const [html, refreshHtml] = useApi(MarkdownService.markdownRender);
  const dimensions = useWindowDimensions();
  const theme = useTheme();

  useEffect(() => {
    refreshHtml({ content: debouncedMarkdown }).catch(_ => {});
  }, [refreshHtml, debouncedMarkdown]);

  if (html.state === "success" && previousHtml !== html.response) {
    setPreviousHtml(html.response);
  }

  return <View style={{ flex: 1, backgroundColor: 'white' }}>
    { 'editTitle' in props && <TextInput style={{ flex: 0, borderBottomWidth: 1, borderBottomColor: 'darkgrey', color: 'black'}} value={title} onChangeText={text => setTitle(text)} placeholder="Title" placeholderTextColor={'gray'}/> }
    <TextInput
      style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: 'darkgrey', color: 'black'}}
      multiline={true}
      value={markdown}
      placeholder="Write here in markdown and see the preview below..."
      placeholderTextColor="grey"
      onChangeText={text => setMarkdown(text)}
    />
    <ScrollView style={{ flex: 1}}>
      {
        (!previousHtml && (html.state === "initial" || html.state === "fetching"))
          ? <ActivityIndicator size={'large'} />
          : <RenderHTML
            source={{html: html.state === "success" ? html.response : previousHtml}}
            contentWidth={dimensions.width}
            baseStyle={{ color: theme.colors.secondary, paddingHorizontal: 0}}
          />
      }
    </ScrollView>
    <Button
      mode="contained"
      icon={props.saveIcon}
      contentStyle={{flexDirection: 'row'}}
      style={{backgroundColor: theme.colors.primary, margin: 10}}
      onPress={() => {if ('editTitle' in props) {
        if (title.trim() !== "" && markdown.trim() !== "") {
          props.onSave(markdown, title);
        } else {
          if (title.trim() === "") {
            Alert.alert("Title cannot be empty");
          } else {
            Alert.alert("Content cannot be empty");
          }
        }
      } else {
        if (markdown.trim() !== "") {
          props.onSave(markdown);
        } else {
          Alert.alert("Content cannot be empty");
        }
      }}}
    >
      {props.saveText}
    </Button>
  </View>;
};

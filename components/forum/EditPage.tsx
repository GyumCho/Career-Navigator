import React from "react";
import { doApiRequest } from "../../util/api.tsx";
import { ForumPageService } from "../../api";
import { StackScreenProps } from "@react-navigation/stack";
import { ForumStackParamList } from "./index.tsx";
import { Editor } from "./Editor.tsx";

type EditCommentProps = StackScreenProps<ForumStackParamList, 'editPage'>;

export const EditPage: React.FC<EditCommentProps> = ({ navigation, route }) => {
  if (route.params.page) {
    const page = route.params.page;
    return <Editor
      onSave={async (text, title) => {
        await doApiRequest(ForumPageService.pageUpdate,
          route.params.categoryId,
          page.id || 0,
          {description: text, title});
        navigation.pop();
      }}
      saveText="Save"
      saveIcon="comment"
      editTitle={true}
      initialText={page.description}
      initialTitle={page.title}
    />;
  } else {
    return <Editor
      onSave={async (text, title) => {
        await doApiRequest(ForumPageService.pageNew, route.params.categoryId, {description: text, title});
        navigation.pop();
      }}
      saveText="Post"
      saveIcon="comment"
      editTitle={true}
    />;
  }
};

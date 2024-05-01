import React from "react";
import { doApiRequest } from "../../util/api.tsx";
import { ForumCommentService } from "../../api";
import { StackScreenProps } from "@react-navigation/stack";
import { ForumStackParamList } from "./index.tsx";
import { Editor } from "./Editor.tsx";

type EditCommentProps = StackScreenProps<ForumStackParamList, 'editComment'>;

export const EditComment: React.FC<EditCommentProps> = ({ navigation, route }) => {
  if (route.params.comment) {
    const comment = route.params.comment;
    return <Editor
      onSave={async (text: string) => {
        await doApiRequest(ForumCommentService.commentUpdate,
          route.params.categoryId,
          comment.page,
          comment.id || 0,
          { description: text });
        navigation.pop();
      }}
      saveText="Update"
      saveIcon="comment"
      initialText={comment.description}
    />;
  } else {
    return <Editor
      onSave={async (text: string) => {
        await doApiRequest(ForumCommentService.commentNew, route.params.categoryId, route.params.pageId, { description: text });
        navigation.pop();
      }}
      saveText="Post"
      saveIcon="comment"
    />;
  }
};

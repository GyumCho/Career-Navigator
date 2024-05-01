import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Linking } from "react-native";
import { useTheme, Text, Button, Card, IconButton } from "react-native-paper";
import AddTip from "./AddTip.tsx";
import EditTip from "./EditTip.tsx";
import { useAuthState } from "../../context/authcontext.tsx";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { MainDrawerProps } from "../../util/nav.ts";
import { TipService } from "../../api";
import { doApiRequest } from "../../util/api.tsx";

const PostTips: React.FC<DrawerScreenProps<MainDrawerProps, 'PostTips'>> = () => {
  const theme = useTheme();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [textTips, setTextTips] = useState<{ id: number, text: string, link: string }[]>([]); //TODO: Replace with actual data from backend
  const [tipToEdit, setTipToEdit] = useState<{ id: number, text: string, link: string} | null>(null);

  const { isMentor } = useAuthState();
  const mentor = isMentor;

  const fetchTips = async () => {
    const tips = await doApiRequest(TipService.tipAll);
    const newTips = tips.map(tip => ({
      id: tip.id || -1,
      text: tip.description || "",
      link: tip.url
    }));
    setTextTips(newTips);
  }
  useEffect(() => {
    fetchTips();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white",
      padding: 10,
    },
    card: {
      backgroundColor: theme.colors.primaryContainer,
      elevation: 4,
      borderRadius: 10,
      marginBottom: 15,
      marginHorizontal: 15,
    },
    cardContent: {
      fontSize: 16,
      marginBottom: 5,
    },
    buttonContent: {
      fontSize: 12,
    },
    cardLabel: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 5,
      marginTop: 5,
    },
  });

  const openAddModal = () => {
    setAddModalVisible(true);
  };

  const closeAddModal = () => {
    setAddModalVisible(false);
  };

  const openEditModal = () => {
    setEditModalVisible(true);
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
  };

  const handleDelete = async (tipToDelete: any) => {
    await doApiRequest(TipService.tipDelete, tipToDelete.id)
    await fetchTips();
  };

  const handleEdit = (theTip: any) => {
    setTipToEdit(theTip);
    openEditModal();
  };

  const handleLink = (link: string) => {
    if (!link.startsWith("http")) {
      link = "http://" + link;
    }
    Linking.openURL(link);
  };

  const saveTextTip = async (data: { text: string, link: string }) => {
    const { text, link } = data;
    const newTip = { text, link };
    if (!newTip.link.startsWith("http")) {
      newTip.link = "http://" + link;
    }
    if (newTip.link.trim() ==="http://") {
      newTip.link = ""
    }
    const tip = await doApiRequest(TipService.tipNew,  newTip.text, newTip.link )
    setTextTips(prevTips => [...prevTips, {
      id: tip.id || 0,
      text: tip.description || "",
      link: tip.url,
    }]);
    closeAddModal();
  };

  const updateTextTip = async (updatedTip: { text: string, link: string, id: number }) => { //TODO: Add logic to update tip in backend
    const data = { text: updatedTip.text, link: updatedTip.link, id: updatedTip.id };
    const newTip = { text: updatedTip.text, link: updatedTip.link, id: updatedTip.id };
    if (!newTip.link.startsWith("http")) {
      newTip.link = "http://" + updatedTip.link;
    }
    if (newTip.link.trim() ==="http://") {
      newTip.link = ""
    }
    const tip = await doApiRequest(TipService.tipEdit, newTip.id, newTip.text, newTip.link )
    setTextTips(prevTips => [...prevTips, {
      id: tip.id || 0,
      text: tip.description || "",
      link: tip.url,
    }]);
    closeEditModal();
  };

  const getButtonContent = (link: string) => {
    const domainRegex = /^(?:https?:\/\/)?(?:www\.)?([^:/\n?]+)\.[a-z]+/;
    const match = link.match(domainRegex);
    if (match && match[1]) {
      const domain = match[1];
      const parts = domain.split('.');
      return parts[0].replace(/^\w/, (c) => c.toUpperCase());
    }
    return 'Click Me!';
  };

  return (
    <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <IconButton icon="refresh" onPress={fetchTips} />
          {
            mentor &&
            (
              <View>
              <Button style={styles.card} onPress={openAddModal}>Add Tip</Button>
              </View>
            )
          }


          {textTips.map((tip) => (
            <Card style={{margin: 15}}>
              <Card.Content>
                <Text style={styles.cardContent}>{tip.text}</Text>

                {tip.link !== "" && (
                  <Button mode={'outlined'} onPress={() => handleLink(tip.link)} icon={'web'}><Text style={styles.buttonContent}>{getButtonContent(tip.link)}</Text> </Button>
                )}
                {
                  mentor &&
                  (
                    <Card.Actions>
                      <IconButton onPress={() => handleEdit(tip)} mode={"contained"} icon={"pencil"} />
                      <IconButton onPress={() => handleDelete(tip)} mode={"contained"} icon={"delete"} />
                    </Card.Actions>
                  )
                }
              </Card.Content>
            </Card>
          ))}

          {textTips.length === 0 && (
            <Text style={{ margin: 10, fontSize: 16, color: 'gray' }}>No tips available</Text>
          )}

        </View>

      </View>
      <AddTip
        visible={addModalVisible}
        onClose={closeAddModal}
        onSave={saveTextTip}
      />
      <EditTip
        visible={editModalVisible}
        onClose={closeEditModal}
        onSave={updateTextTip}
        tipToEdit={tipToEdit}
      />
    </ScrollView>
  );
};

export default PostTips;

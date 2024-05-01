import React, { useState } from "react";
import { Modal, Text, View, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import AddItemForm from "./AddItemForm.tsx";
import EditItemForm from "./EditItemForm.tsx";
import {useTheme} from "react-native-paper";

const AddRemoveModal: React.FC<{
  category: string,
  visible: boolean,
  items: {[key: string]: string}[],
  onClose: () => void,
  onAddItem: (formData: any) => void,
  onEditItem: (item: any, index: number) => void,
}> = ({ visible, category, items, onClose, onAddItem, onEditItem }) => {
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [showEditItemForm, setShowEditItemForm] = useState(false);
  const [editItemData, setEditItemData] = useState({});

  const theme = useTheme();
  const renderItem = ({ item, index }: any) => {
    if (index === 0) {
      return null;
    }
    let itemText = "";
    switch (category) {
      case "Education":
        itemText = `${item.degree}, ${item.institution}, ${item.duration}`;
        break;
      case "Work Experience":
        itemText = `${item.company}, ${item.position}, ${item.duration}`;
        break;
      case "Interests":
        itemText = `${item.interest}`;
        break;
      case "Skills":
        itemText = `${item.skill}`;
        break;
      case "Contact Information":
        itemText = `${item.email}, ${item.phone}, ${item.address}`;
        break;
      case "Other":
        itemText = `${item.other}`;
        break;
      default:
        break;
    }
    return (
      <TouchableOpacity onPress={() => handleEditItem(item, index)}>
        <Text style={styles.item}>{itemText}</Text>
      </TouchableOpacity>
    );
  };

  const handleAddItem = () => {
    setShowAddItemForm(true);
  };

  const handleEditItem = (item: any, index: number) => {
    onEditItem(item, index);
    setEditItemData(item); // Set the data of the item being edited
    setShowEditItemForm(true); // Show the edit form
  };

  const handleSubmitItemForm = (formData: any) => {
    setShowAddItemForm(false);
    onAddItem(formData);
  };

  const handleSubmitEditItemForm = (formData: any, index: number) => {
    setShowEditItemForm(false);
    onEditItem(formData, index);
  };

  const handleCloseAddItemForm = () => {
    setShowAddItemForm(false);
  };

  const handleCloseEditItemForm = () => {
    setShowEditItemForm(false);
  };

  const styles = StyleSheet.create({
    modalBG: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    modalContainer: {
      backgroundColor: theme.colors.primary,
      padding: 20,
      borderRadius: 10,
      width: "70%",
      height: "70%",
      zIndex: 1,
    },
    title: {
      color: "white",
      fontSize: 24,
      marginTop: 15,
      alignSelf: "center",
    },
    button: {
      color: "white",
      fontSize: 20,
      marginTop: 15,
      textDecorationLine: "underline",
    },
    item: {
      color: "white",
      fontSize: 20,
      marginTop: 15,
    },
    help: {
      color: "lightgray",
      fontSize: 12,
      marginTop: 15,
      alignSelf: "center",
    },
    scrollViewContainer: {
      flexGrow: 1,
    },
  });

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalBG}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>{category}</Text>
          <Text style={styles.help}> Click "Add Item" to add new data. Click an existing entry to edit</Text>
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            style={
              { flex: 1 }
            }
          />
          <TouchableOpacity onPress={handleAddItem}>
            <Text style={styles.button}>Add Item</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.button}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
      {showAddItemForm && (
        <AddItemForm
          category={category}
          onSubmit={handleSubmitItemForm}
          onClose={handleCloseAddItemForm}
        />
      )}
      {showEditItemForm && (
        <EditItemForm
          category={category}
          initialFormData={editItemData} // Pass the initial data of the item being edited
          onSubmit={handleSubmitEditItemForm}
          onClose={handleCloseEditItemForm}
        />
      )}
    </Modal>
  );
};


export default AddRemoveModal;

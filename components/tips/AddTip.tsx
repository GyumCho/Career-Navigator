import React, { useMemo, useState } from "react";
import { Modal, TextInput, View, StyleSheet, Text } from "react-native";
import { useTheme, Button } from "react-native-paper";

const AddTip = ({ visible, onClose, onSave }: any) => {
  const [text, setText] = useState("");
  const [link, setLink] = useState("");
  const theme = useTheme();

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      backgroundColor: "white",
      padding: 20,
      borderRadius: 10,
      elevation: 5,
      width: "80%",
      maxHeight: "80%",
    },
    textInput: {
      borderWidth: 1,
      borderColor: "lightgray",
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
      maxHeight: "60%",
      color: theme.colors.onPrimaryContainer,
      backgroundColor: theme.colors.primaryContainer,
    },
    saveButton: {
      marginBottom: 10,
    },
    closeButton: {
      marginBottom: 10,
    },
    header: {
      fontSize: 16,
      color: "black",
      margin: 10,
      alignSelf: "flex-start",
    },
    star: {
      color: "red",
      textAlignVertical: "top",
      fontSize: 16 * 1.1,
    },
  });

  const handleSave = () => {
    const data = { text, link };
    onSave(data);
    setText("");
    setLink("");
  };

  const isFormValid = useMemo(() => {
    let errors: { [key: string]: string } = {};
    if (!text.trim()) {
      errors.text = "Text is required";
    }
    return Object.keys(errors).length === 0;
  }, [text]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.header}>
            Add a new tip <Text style={styles.star}>*</Text>
          </Text>
          <TextInput
            style={styles.textInput}
            multiline
            value={text}
            onChangeText={setText}
            placeholder="Type your text here"
            placeholderTextColor="gray"
          />
          <Text style={styles.header}>
            Link (optional)
          </Text>
          <TextInput
            style={styles.textInput}
            multiline
            value={link}
            onChangeText={setLink}
            placeholder="Enter a link (optional)"
            placeholderTextColor="gray"
            autoCapitalize="none"
          />
          <Button mode="contained" onPress={handleSave} style={styles.saveButton} buttonColor={theme.colors.primary} textColor={theme.colors.primaryContainer} disabled={!isFormValid}>
            Save
          </Button>
          <Button mode="outlined" onPress={onClose} style={styles.closeButton} buttonColor={theme.colors.secondary} textColor={theme.colors.secondaryContainer}>
            Close
          </Button>
        </View>
      </View>
    </Modal>
  );
};

export default AddTip;

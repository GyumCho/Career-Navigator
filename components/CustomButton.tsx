import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";


const styles = StyleSheet.create({
    button : {
        backgroundColor : '#03045e',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 15,
        marginRight: 10,
        alignItems: 'center',
    },
    buttonText : {
        color : 'white',
    },
});

const CustomButton: React.FC<{children: Text["props"]["children"], style: {[key: string]: any}}> = ({children}) => {
    return <Pressable>
        <View style={styles.button}>
            <Text style={styles.buttonText}>{children}</Text>
        </View>
    </Pressable>;
};

export default CustomButton;

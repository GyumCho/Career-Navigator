import React from "react";
import { View, StyleSheet, TouchableHighlight, Image} from "react-native";
import IoIcon from 'react-native-vector-icons/Ionicons';
import { Text, useTheme } from "react-native-paper";
import { Job } from "../../api";


const styles = StyleSheet.create({
    card : {
        borderRadius: 30,
        marginVertical: 8,
        padding: 20,
        height: 120,
    },
    cardElevated : {
        backgroundColor: '#FFFFFF',
        elevation: 3,
        shadowOffset: {
            width: 1,
            height: 1,
        },
    },
    cardTitle : {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
    },
    cardBody: {
        flex: 1,
        flexGrow: 1,
        paddingVertical: 10,
        backgroundColor: 'white',
    },
    cardLabel : {
        color : 'black',
        fontSize: 16,
    },
    cardLocationText : {
        fontSize : 16,
    },
    cardDescription : {
        color: 'black',
    },
    cardTag: {
        backgroundColor: '#e6e4e6',
        flexDirection: 'row',
        alignContent: 'center',
        alignSelf: 'flex-start',
        marginHorizontal: 14,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
    },
    cardTagText: {
        fontWeight: 'bold',
    },
    bookmark: {
        paddingVertical: 10,
    },
    logo: {
        backgroundColor: 'white',
        height: 50,
        width: 50,
        borderRadius: 6,
        paddingBottom: 20,
    },
    mainLine : {
        flexDirection: "row",
    },
    bookmarkView : {
        flexDirection: "row",
        paddingVertical : 10,
    },
    info : {
        paddingHorizontal: 15,
        width: 220,
    },
});

const JobItem : React.FC<{job: Job, onPress: () => void}> = ({job, onPress}) => {
    const theme = useTheme();

    return (
        <View>
            <View style={[styles.card, styles.cardElevated]}>
                <View style={styles.cardBody}>
                    <View style={styles.mainLine}>
                        <Image
                                style={styles.logo}
                                source={{uri : job.image}}
                            />
                        <View style={styles.info}>
                            <Text numberOfLines={1} style={styles.cardTitle}>{job.title}</Text>
                            <Text style={styles.cardLabel}>{job.company.name}</Text>
                            <Text style={styles.cardLocationText}>{job.location}</Text>
                        </View>
                        <View style={styles.bookmarkView}>
                            <TouchableHighlight onPress={onPress}>
                        <IoIcon style={styles.bookmark} name={job.fav ? "bookmark" : "bookmark-outline"} size={30} color={theme.colors.primary}/>
                    </TouchableHighlight>
                    </View>


                    </View>


                </View>

            </View>
        </View>
    );
};

export default JobItem;

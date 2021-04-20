import { Ionicons } from '@expo/vector-icons';
import React from "react";
import { ScrollView, StyleSheet, Pressable, View } from "react-native";
import Mec2Constraints from '../ModelProperties/Mec2Constraints';
import Mec2Id from '../ModelProperties/Mec2Id';
import Mec2Nodes from '../ModelProperties/Mec2Nodes';
import Mec2UndoRedo from './Mec2UndoRedo';

function Header({ navigation } = {} as any) {
    return <View style={styles.header}>
        <Pressable onPress={navigation.closeDrawer}>
            <Ionicons name="arrow-forward" size={32} />
        </Pressable>
    </View>
}

export default function RightDrawer({ navigation } = {} as any) {
    return <ScrollView horizontal={true}>
        <ScrollView style={styles.container}>
            <Header navigation={navigation} />
            <View style={styles.idUndoRedo}>
                <Mec2Id />
                <Mec2UndoRedo />
            </View>
            <Mec2Nodes />
            <Mec2Constraints />
        </ScrollView>
    </ScrollView>
};

const styles = StyleSheet.create({
    container: {
        // Same as parent, but 100% does not work...
        width: 400,
        // After modal deselect the background becomes transparent if it is not defined here:
        backgroundColor: 'white',
    },
    header: {
        top: 0,
        right: 0,
        width: "100%",
        height: 60,
        flexDirection: "row-reverse",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20
    },
    idUndoRedo: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
    }
});
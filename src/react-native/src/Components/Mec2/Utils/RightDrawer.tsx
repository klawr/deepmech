import { Ionicons } from '@expo/vector-icons';
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSelector } from 'react-redux';
import { mecModelSelect } from '../../../Redux/MecModelSlice';
import Mec2Id from '../ModelProperties/Mec2Id';
import Mec2UndoRedo from './Mec2UndoRedo';

function Header({ navigation } = {} as any) {
    return <View style={styles.header}>
        <TouchableOpacity onPress={navigation.closeDrawer}>
            <Ionicons name="arrow-forward" size={32} />
        </TouchableOpacity>
    </View>
}

export default function RightDrawer({ navigation } = {} as any) {
    const modelSlice = useSelector(mecModelSelect);
    const model = modelSlice.model;

    return <View>
        <Header navigation={navigation} />
        <View style={styles.idUndoRedo}>
            <Mec2Id />
            <Mec2UndoRedo />
        </View>
        <Text>{"TODO Input some text here"}</Text>
    </View>
};

const styles = StyleSheet.create({
    header: {
        top: 0,
        width: "100%",
        height: 60,
        flexDirection: "row",
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
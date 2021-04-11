import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useDispatch } from 'react-redux';
import { mecModelAction } from '../../../Redux/MecModelSlice';

export default function Mec2UndoRedo() {
    const dispatch = useDispatch();

    return <View style={styles.row}>
        <TouchableOpacity onPress={() => dispatch(mecModelAction.undo())}>
            <Ionicons name="arrow-undo" size={32} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => dispatch(mecModelAction.redo())}>
            <Ionicons name="arrow-redo" size={32} />
        </TouchableOpacity>
    </View>
}

const styles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: "row",
        alignItems: 'center',
    }
})

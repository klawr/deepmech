import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { mecModelAction, mecModelSelect } from '../../../Redux/MecModelSlice';

export default function Mec2UndoRedo() {
    const model = useSelector(mecModelSelect);
    const dispatch = useDispatch();

    return <View style={styles.row}>
        <TouchableOpacity
            disabled={!model.pastModels.length}
            onPress={() => dispatch(mecModelAction.undo())}>
            <Ionicons
                style={!model.pastModels.length ?
                    styles.disabled :
                    styles.enabled}
                name="arrow-undo" size={32} />
        </TouchableOpacity>
        <TouchableOpacity
            disabled={!model.futureModels.length}
            onPress={() => dispatch(mecModelAction.redo())}>
            <Ionicons
                style={!model.futureModels.length ?
                    styles.disabled :
                    styles.enabled}
                name="arrow-redo" size={32} />
        </TouchableOpacity>
    </View>
}

const styles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: "row",
        alignItems: 'center',
    },
    enabled: {
        color: '#000',
    },
    disabled: {
        color: '#ccc',
    }
})

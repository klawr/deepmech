import React from 'react';
import { StyleSheet, TextInput } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { mecModelAction, mecModelSelect } from '../../../Redux/MecModelSlice';

export default function Mec2Id() {
    const model = useSelector(mecModelSelect);
    const id = model.model.id;
    const dispatch = useDispatch();

    return <TextInput
        placeholder={"Model id"}
        style={styles.input}
        value={id}
        onChangeText={(text: string) => dispatch(mecModelAction.updateId(text))} />
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
    },
});

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { mecModelAction, mecModelSelectModel } from '../../../Redux/MecModelSlice';
import { IModel } from "mec2-module";
import getMec2Cell, { IMec2Cell } from "../Utils/Mec2Cell";
import { MecElement } from './Mec2Cell';

function DataRow({ head, name, item, idx, Mec2Cell }: any) {
    const dispatch = useDispatch();
    function remove() {
        dispatch(mecModelAction.add({ list: name, idx, value: {}, previous: {} }))
    }

    return <View
        key={`dataRow_${idx}`}
        style={styles.datarow}>
        {head.map((e: string, i: number) =>
            <Mec2Cell
                key={`cell_${e}_${i}`}
                idx={idx}
                elm={item}
                property={e} />)}
        <Pressable onPress={remove}>
            <Ionicons name="remove" size={32} />
        </Pressable>
    </View>
}

export default function DataTable({ args, head }: { args: IMec2Cell, head: string[] }) {
    const model = useSelector(mecModelSelectModel);
    const Mec2Cell = getMec2Cell(args);
    const list = model[args.name as keyof IModel] as MecElement[];

    return <View style={styles.container}>
        <View style={styles.datarow}>
            {head.map((e: string, idx: number) => <Text key={`text_${idx}`}>{e}</Text>)}
            <View style={styles.placeholderForRemoveButtonButInHead} />
        </View>
        {list.map((item: any, idx: number) =>
            DataRow({ head, name: args.name, item, idx, Mec2Cell }))}
    </View>
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        justifyContent: 'space-between',
    },
    datarow: {
        flex: 1,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderColor: '#efefef',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    placeholderForRemoveButtonButInHead: {
        width: 32,
    }
})

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { mecModelSelectModel } from '../../../Redux/MecModelSlice';
import { IModel } from "mec2-module";
import getMec2Cell, { IMec2Cell } from "../Utils/Mec2Cell";
import { MecElement } from './Mec2Cell';

function DataRow({ head, item, idx, Mec2Cell }: any) {
    return <View
        key={`dataRow_${idx}`}
        style={styles.datarow}>
        {head.map((e: string, i: number) =>
            <Mec2Cell
                key={`cell_${e}_${i}`}
                idx={idx}
                elm={item}
                property={e} />)}
    </View>
}

export default function DataTable({ args, head }: { args: IMec2Cell, head: string[] }) {
    const model = useSelector(mecModelSelectModel);
    const Mec2Cell = getMec2Cell(args);
    const list = model[args.name as keyof IModel] as MecElement[];

    return <View style={styles.container}>
        <View style={styles.datarow}>
            {head.map((e: string, idx: number) => <Text key={`text_${idx}`}>{e}</Text>)}
        </View>
        {list.map((item: any, idx: number) =>
            DataRow({ head, item, idx, Mec2Cell }))}
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
    }
})

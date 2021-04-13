import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

function DataRow({ head, item, idx, Mec2Cell }: any) {
    return <View style={styles.datarow}>
        {head.map((e: string) =>
            <Mec2Cell
                idx={idx}
                elm={item}
                property={e} />)}
    </View>
}

export default function DataTable({ head, list, Mec2Cell }: any) {
    return <View style={styles.container}>
        <View style={styles.datarow}>
            {head.map((e: string) => <Text>{e}</Text>)}
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

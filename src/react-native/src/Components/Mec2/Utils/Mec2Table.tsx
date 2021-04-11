import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

function DataRow({ head, item, idx, SanitizedCell }: any) {
    return <View style={styles.datarow}>
        {head.map((e: string) =>
            <SanitizedCell
                idx={idx}
                elm={item}
                property={e} />)}
    </View>
}

export default function DataTable({ head, list, SanitizedCell }: any) {
    return <View>
        <View style={styles.datarow}>
            {head.map((e: string) => <Text>{e}</Text>)}
        </View>
        {list.map((item: any, idx: number) =>
            DataRow({ head, item, idx, SanitizedCell }))}
    </View>
}

const styles = StyleSheet.create({
    datarow: {
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderColor: '#efefef',
        justifyContent: 'space-between',
        flexDirection: 'row',
        display: 'flex'
    }
})

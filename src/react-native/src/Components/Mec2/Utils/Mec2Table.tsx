import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

function DataRow({ head, item, SanitizedCell }: any) {
    return <View style={styles.datarow}>
        {head.map((e: string) => <SanitizedCell>{item[e]}</SanitizedCell>)}
    </View>
}

export default function DataTable({ head, list, SanitizedCell }: any) {
    return <View>
        <View style={styles.datarow}>
            {head.map((e: string) => <Text>{e}</Text>)}
        </View>
        {list.map((item: any) => DataRow({ head, item, SanitizedCell }))}
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

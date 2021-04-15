
import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { IMec2CellPropertyArgs } from './Mec2Cell';

export default function Mec2TextCell({ property, elm, update }: IMec2CellPropertyArgs) {
    return <TextInput
        style={styles.text}
        value={elm[property] as string}
        placeholder={property}
        onChangeText={(v) => update(+v)} />
}

const styles = StyleSheet.create({
    text: {
        flex: 1,
        width: 50,
        textAlign: 'center',
    }
})

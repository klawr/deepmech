
import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

export default function Mec2TextCell({ property, elm, update }: any) {
    return <TextInput
        style={styles.text}
        value={elm[property]}
        placeholder={property}
        onChangeText={update} />
}

const styles = StyleSheet.create({
    text: {
        flex: 1,
        width: 50,
        textAlign: 'center',
    }
})

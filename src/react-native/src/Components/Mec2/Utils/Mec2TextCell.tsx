
import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import Mec2Cell from './Mec2Cell';

export default function Mec2TextCell({ property, elm, update }: any) {
    return <Mec2Cell>
        <TextInput
            style={styles.text}
            value={elm[property]}
            placeholder={property}
            onChangeText={update} />
    </Mec2Cell>
}

const styles = StyleSheet.create({
    text: {
        flex: 1,
        width: 50,
        textAlign: 'center',
    }
})

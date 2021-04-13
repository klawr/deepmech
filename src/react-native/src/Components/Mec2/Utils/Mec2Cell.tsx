
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function Mec2Cell({ children }: any) {
    return <View style={styles.sanitizedCell}>
        {children}
    </View>
}

const styles = StyleSheet.create({
    sanitizedCell: {
        display: 'flex',
        flex: 1,
        alignItems: "flex-end",
        alignContent: "center",
        width: 50,
        textAlign: 'center',
    }
});



import React from 'react';
import { StyleSheet, View } from 'react-native';
import Header from '../Header';
import { Camera } from 'expo-camera';

export default function ACamera({ navigation } = {} as any) {
    return <View style={styles.container}>
        <Camera style={styles.container} type="back" />
        <Header navigation={navigation} />
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#aaa',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    },
});

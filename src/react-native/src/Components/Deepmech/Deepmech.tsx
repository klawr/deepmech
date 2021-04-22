import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Header from '../Header';

export default function Mec2({ navigation } = {} as any) {
    return <View style={{ flex: 1 }}>
        <Text>Hello Deepmech</Text>
        <Header navigation={navigation} />
    </View >
}

const styles = StyleSheet.create({
});

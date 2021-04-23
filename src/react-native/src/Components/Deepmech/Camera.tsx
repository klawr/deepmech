
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Header from '../Header';
import { Camera } from 'expo-camera';

function Wrap({ navigation, children } = {} as any) {
    return <View style={styles.container}>
        {children}
        <Header navigation={navigation} />
    </View>
}

export default function ACamera({ navigation } = {} as any) {
    const [granted, setGranted] = React.useState(false);

    if (Platform.OS === 'android') {
        const { check, PERMISSIONS, request, RESULTS } = require('react-native-permissions');
        function androidRequest(result: string | typeof RESULTS) {
            switch (result) {
                case RESULTS.GRANTED:
                    setGranted(true);
                    break;
                default:
                    request(PERMISSIONS.ANDROID.CAMERA).then(androidRequest);
                    break;
            }
        }

        check(PERMISSIONS.ANDROID.CAMERA).then(androidRequest);
    }

    // Web handles this stuff itself.
    if (Platform.OS === 'web') {
        setGranted(true);
    }

    return <Wrap navigation={navigation}>
        {granted ?
            <Camera style={styles.container} type="back" /> :
            <View style={styles.warning}><Text>No permission to use camera.</Text></View>
        }
    </Wrap>
}

const styles = StyleSheet.create({
    warning: {
        flex: 1,
        alignItems: 'center',
        alignContent: 'center',
    },
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

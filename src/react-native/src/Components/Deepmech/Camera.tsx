
import React from 'react';
import { Button, Dimensions, Platform, StyleSheet, Text, View } from 'react-native';
import Header from '../Header';
import { Camera } from 'expo-camera';
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO, cameraWithTensors } from '@tensorflow/tfjs-react-native';
import Predictor from './Predictor';

function Wrap({ navigation, children } = {} as any) {
    return <View style={styles.container}>
        {children}
        <Header navigation={navigation} />
    </View>
}
const TensorCamera = cameraWithTensors(Camera);

export default function ACamera({ navigation } = {} as any) {
    const [granted, setGranted] = React.useState(false);
    const [image, setImage] = React.useState(null);
    const [ready, setReady] = React.useState(false);
    const modelRef: React.MutableRefObject<tf.LayersModel> = React.useRef(null) as any;
    const imageRef: React.MutableRefObject<tf.Tensor3D> = React.useRef(null) as any;

    const modelJson = require('../../../assets/models/symbol_detector.json');
    const modelWeights = require('../../../assets/models/symbol_detector.bin');

    const width = Dimensions.get("window").width;
    const height = Dimensions.get("window").height;

    const tensorCameraProps = {
        cameraTextureHeight: height,
        cameraTextureWidth: width,
        resizeHeight: height,
        resizeWidth: width,
        resizeDepth: 3,
        onReady: onReady,
        autorender: true,
    }

    async function onReady(images: IterableIterator<tf.Tensor3D>) {
        const loop = () => {
            imageRef.current = images.next().value;
            requestAnimationFrame(loop);
        };
        loop();
    }
    tf.ready().then(() => {
        tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights))
            .then(r => modelRef.current = r);
    });

    function onPress() {
        if (imageRef.current) {
            setImage(imageRef.current as any);
        }
    }

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
            <View style={styles.container}>
                <Predictor image={image} model={modelRef} />
                <Button onPress={onPress} title="Test" />
                <TensorCamera style={{ ...styles.container, zIndex: 1 }} type={Camera.Constants.Type.back}  {...tensorCameraProps} />
            </View> :
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

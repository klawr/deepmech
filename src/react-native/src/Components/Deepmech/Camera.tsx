
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Header from '../Header';
import { Camera } from 'expo-camera';
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO, cameraWithTensors } from '@tensorflow/tfjs-react-native';
import { g2 } from 'g2-module';
import G2SVG from '../G2/G2SVG';
import { mecModelSelectModel } from '../../Redux/MecModelSlice';
import { useSelector } from 'react-redux';
import { mec } from 'mec2-module';

function Wrap({ navigation, children } = {} as any) {
    return <View style={styles.container}>
        {children}
        <Header navigation={navigation} />
    </View>
}

const TensorCamera = cameraWithTensors(Camera);

export default function ACamera({ navigation } = {} as any) {
    const modelSlice = useSelector(mecModelSelectModel);
    const mecModel = JSON.parse(JSON.stringify(modelSlice));
    mec.model.extend(mecModel);
    mecModel.init();
    const y = Platform.OS === 'android' ? -400 : 100;
    const g = g2().view({ x: 0, y, cartesian: true });
    mecModel.draw(g);

    const tensorCameraProps = {
        cameraTextureHeight: 1200,
        cameraTextureWidth: 600,
        resizeHeight: 152, // inputTensorHeight
        resizeWidth: 200, // inputTensorWidth
        resizeDepth: 3,
        onReady: onReady,
        autorender: true,
    }

    const model: React.MutableRefObject<tf.LayersModel> = React.useRef(null) as any;
    // Should later be used to be able to cancel animationframe. 
    // If this were a class it would be:
    /**
    componentWillUnmount() {
        if(this.rafID) {
            cancelAnimationFrame(this.rafID);
        }
    }
     */
    // So it should be implemented using React.useEffect or sth...
    let rafId: number;

    tf.ready().then(() => {
        const modelJson = require('../../../assets/models/symbol_detector.json');
        const modelWeights = require('../../../assets/models/symbol_detector.bin');
        tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights))
            .then(r => model.current = r);
    });

    async function onReady(images: IterableIterator<tf.Tensor3D>) {
        const loop = async () => {
            if (model.current != null) {
                const imageTensor = images.next().value;
                model.current.predict(imageTensor)
                if (imageTensor) {
                    // TODO Create command queue
                }
                tf.dispose([imageTensor]);
            }

            rafId = requestAnimationFrame(loop);
        };

        loop();
    }

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
            <View style={styles.container}>
                <TensorCamera style={{ ...styles.container, zIndex: 1 }} type={Camera.Constants.Type.back}  {...tensorCameraProps} />
                <G2SVG style={{ ...styles.container, position: "absolute", backgroundColor: "transparent", zIndex: 20 }} cq={g} />
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

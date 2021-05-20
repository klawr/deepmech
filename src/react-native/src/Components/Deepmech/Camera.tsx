
import React from 'react';
import { Dimensions, Platform, StyleSheet, Text, View } from 'react-native';
import Header from '../Header';
import { Camera } from 'expo-camera';
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO, cameraWithTensors } from '@tensorflow/tfjs-react-native';
import { g2 } from 'g2-module';
import G2SVG from '../G2/G2SVG';
import { mecModelSelectModel } from '../../Redux/MecModelSlice';
import { useSelector } from 'react-redux';
import { IMecModel, mec } from 'mec2-module';
import Svg, { Rect } from 'react-native-svg';

function Wrap({ navigation, children } = {} as any) {
    return <View style={styles.container}>
        {children}
        <Header navigation={navigation} />
    </View>
}
const TensorCamera = cameraWithTensors(Camera);

export default function ACamera({ navigation } = {} as any) {

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

    const model: React.MutableRefObject<tf.LayersModel> = React.useRef(null) as any;
    const [mecModel, setMecModel] = React.useState({} as IMecModel);

    const [text, setText] = React.useState("");

    mec.model.extend(mecModel);
    mecModel.init();
    const y = Platform.OS === 'android' ? - height * 0.96 : 100;
    const g = g2().view({ y, cartesian: true });
    mecModel.draw(g);
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

    const modelJson = require('../../../assets/models/symbol_detector.json');
    const modelWeights = require('../../../assets/models/symbol_detector.bin');

    tf.ready().then(() => {
        tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights))
            .then(r => model.current = r);
    });

    async function onReady(images: IterableIterator<tf.Tensor3D>) {
        const rgb = tf.tensor1d([0.2989, 0.587, 0.114]);
        const loop = async () => {
            if (model.current != null) {

                let image = images.next().value;

                if (image) {
                    const imageTensor = tf
                        .sum(image.mul(rgb), 2)
                        .div(255)
                        .round()
                        .expandDims(-1)
                        .expandDims(0)

                    const pred = model.current.predict(imageTensor) as tf.Tensor<tf.Rank>;
                    tf.dispose([imageTensor]);
                    if (pred) {
                        setText(tf.argMax(tf.squeeze(pred), -1).greater(0).toString());
                        // tf.whereAsync(tf.argMax(tf.squeeze(pred), -1).greater(0)).then(a => {
                        // setMecModel({
                        //     nodes: a.arraySync().map((e: any) => ({
                        //         x: e[1] * image.shape[1] / pred.shape[2]!,
                        //         y: e[0] * image.shape[0] / pred.shape[1]!
                        //     }))
                        // } as any);
                        // rafId = requestAnimationFrame(loop);
                        // });
                        requestAnimationFrame(loop);
                    }
                }
                tf.dispose([image]);
            }

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
                <Text style={{ ...styles.container, position: "absolute", backgroundColor: "transparent", zIndex: 20 }}>{text}</Text>
                <Svg style={{ ...styles.container, position: "absolute", backgroundColor: "transparent", zIndex: 20 }}><Rect x={60} y={0} width={32} height={32} /></Svg>
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

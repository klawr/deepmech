import React from 'react';
import { IMecModel, mec } from 'mec2-module';
import { Dimensions, Platform, StyleSheet, Text, View } from 'react-native';
import G2SVG from '../G2/G2SVG';
import Svg, { Rect } from 'react-native-svg';
import { g2 } from 'g2-module';
import * as tf from '@tensorflow/tfjs';
import { ScrollView } from 'react-native-gesture-handler';

export default function App({ image, model } = {} as any) {
    const height = Dimensions.get("window").height;
    const y = Platform.OS === 'android' ? - height * 0.96 : 100;
    const g = React.useRef(g2().view({ y, cartesian: true }).rec({ x: 0, y: 19, b: 32, h: 32 }));
    const [text, setText] = React.useState("nothing yet")

    if (image && model && model.current) {
        // const rgb = tf.tensor1d([0.2989, 0.587, 0.114]);
        const imageTensor = tf.tensor(1)
            .sub(tf.sum(image, -1).div(255 * 3))
            .round()
            .expandDims(-1)
            .expandDims(0);
        const pred = model.current.predict(imageTensor) as tf.Tensor<tf.Rank>;
        // tf.dispose([imageTensor]);

        tf.argMax(tf.squeeze(pred), -1).greater(0).toString();
        tf.whereAsync(tf.argMax(tf.squeeze(pred), -1).greater(0)).then(a => {
            const mecModel = {
                nodes: a.arraySync().map((e: any) => ({
                    x: e[1] * image.shape[1] / pred.shape[2]!,
                    y: e[0] * image.shape[0] / pred.shape[1]!
                })),
            } as any;

            g.current.txt({ x: 50, y: 50, str: "hi" });

            mec.model.extend(mecModel);
            mecModel.init();
            mecModel.draw(g.current);
        });
    }
    tf.dispose([image]);
    return <View style={{
        ...styles.container,
        position: "absolute",
        zIndex: 20,
    }}>
        <G2SVG
            style={{
                ...styles.container,
                position: "absolute",
                backgroundColor: "#f00a",
                zIndex: 20,
                top: 20,
            }}
            cq={g.current} />
    </View>
    //     <Text style={{ ...styles.container, position: "absolute", top: 60, backgroundColor: "transparent", zIndex: 20, color: "white" }}>{text}</Text>

    // </View>
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


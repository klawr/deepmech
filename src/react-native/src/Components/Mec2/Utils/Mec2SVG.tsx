import { IConstraintExtended, IMecModel } from 'mec2-module';
import * as React from 'react';
import { useDispatch, useSelector } from "react-redux";
import G2SVG from 'react-native-g2';
import { mecModelAction, mecModelSelect } from '../../../Redux/MecModelSlice';
import { g2 } from 'g2-module';
import { StyleSheet, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';

export default function Mec2SVG({ model, g, drive } = {} as { model: IMecModel, g: g2, drive: IConstraintExtended }) {
    const dispatch = useDispatch();
    const phi = useSelector(mecModelSelect).phi;

    let ori;
    if (drive) {
        if (drive.ori.inputCallbk) {
            ori = true;
            drive.ori.inputCallbk!(phi);
        }
        else if (drive.len.inputCallbk) {
            ori = false;
            drive.len.inputCallbk!(phi);
        }
    }

    model.tick();
    return <View style={styles.container}>
        <G2SVG cq={g} width={global.innerWidth} height={"90%"} />
        {!!drive && <View style={styles.sliderrow}>
            <Text style={styles.phitext}>{Math.round(phi)}{ori && "°"}</Text>
            <Slider
                onValueChange={(v) => dispatch(mecModelAction.updatePhi(v))}
                style={{ width: 200, height: 40 }}
                minimumValue={0}
                maximumValue={360}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#000000"
            />
        </View>}
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    sliderrow: {
        paddingHorizontal: 50,
        flexDirection: 'row',
        alignItems: 'center',
    },
    phitext: {
        width: 50,
    }
});
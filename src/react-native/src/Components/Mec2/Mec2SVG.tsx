import { mec } from 'mec2-module';
import * as React from 'react';
import { useSelector } from "react-redux";
import G2SVG from 'react-native-g2';
import { mecModelSelect } from '../../Redux/MecModelSlice';

export default function Mec2SVG({ model, g } = {} as { model: mec, g: any }) {
    const phi = useSelector(mecModelSelect).phi;

    if (model.constraints[0].ori.inputCallbk) {
        model.constraints[0].ori.inputCallbk(phi);
    }
    model.tick();
    return <G2SVG cq={g} width={400} height={800} />
}
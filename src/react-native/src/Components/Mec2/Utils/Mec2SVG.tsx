import { IConstraintExtended, IMecModel } from 'mec2-module';
import * as React from 'react';
import { useSelector } from "react-redux";
import G2SVG from 'react-native-g2';
import { mecModelSelect } from '../../../Redux/MecModelSlice';
import { g2 } from 'g2-module';

export default function Mec2SVG({ model, g, drive } = {} as { model: IMecModel, g: g2, drive: IConstraintExtended }) {
    const phi = useSelector(mecModelSelect).phi;

    if (drive.ori.inputCallbk) {
        drive.ori.inputCallbk(phi);
    }
    model.tick();
    return <G2SVG cq={g} width={"100%"} height={"90%"} />
}
import React from "react";
import { Platform, StyleSheet, Switch, View } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { mecModelAction, mecModelSelect } from "../../../Redux/MecModelSlice";
import Accordion from "../../Utils/Accordion";
import Mec2Table from "../Utils/Mec2Table";
import Mec2AddConstraint from "./Add/Mec2AddConstraint";
import { INode } from "mec2-module";
import Mec2TextCell from "../Utils/Mec2TextCell";
import Mec2Cell from "../Utils/Mec2Cell";
import ModalSelect from "../../Utils/ModalSelect";
import getSanitizedCell from "../Utils/SanitizedCell";

export default function Mec2Constraints() {
    const args = {
        dispatch: useDispatch(),
        model: useSelector(mecModelSelect).model,
        name: 'constraints',
        sanitizedCell: {
            id: (args: any) => <Mec2TextCell {...args} />,
            p1: (args: any) => <PointSelect {...args} />,
            p2: (args: any) => <PointSelect {...args} />,
            len: (args: any) => <TypeSelect {...args} />,
            ori: (args: any) => <TypeSelect {...args} />,
        },
    };

    const list = args.model[args.name];
    const head = ['id', 'p1', 'p2', 'len', 'ori'];

    return <Accordion title={args.name}>
        <Mec2Table list={list} head={head} SanitizedCell={getSanitizedCell(args)} />
        <Mec2AddConstraint />
    </Accordion>
}

function TypeSelect({ property, elm, update }: any) {
    return <Mec2Cell>
        <ModalSelect
            selected={elm[property]?.type || 'free'}
            options={['free', 'const', 'drive']}
            onPress={(e: string) => update({ type: e })} />
    </Mec2Cell>
}


function PointSelect({ property, elm, update, model }: any) {
    return <Mec2Cell>
        <ModalSelect
            selected={elm[property]}
            options={model.nodes
                .map((e: INode) => e.id)
                .filter((e: string) => e !== elm[property])}
            onPress={update} />
    </Mec2Cell>
}

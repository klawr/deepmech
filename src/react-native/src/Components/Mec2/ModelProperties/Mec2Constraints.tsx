import { INode } from "mec2-module";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { mecModelSelect } from "../../../Redux/MecModelSlice";
import Accordion from "../../Utils/Accordion";
import ModalSelect from "../../Utils/ModalSelect";
import Mec2Table from "../Utils/Mec2Table";
import Mec2TextCell from "../Utils/Mec2TextCell";
import getSanitizedCell from "../Utils/SanitizedCell";
import Mec2AddConstraint from "./Add/Mec2AddConstraint";

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
    return <ModalSelect
        selected={elm[property]?.type || 'free'}
        options={['free', 'const', 'drive']}
        onPress={(e: string) => update({ type: e })} />
}


function PointSelect({ property, elm, update, model }: any) {
    return <ModalSelect
        selected={elm[property]}
        options={model.nodes
            .map((e: INode) => e.id)
            .filter((e: string) => e !== elm[property])}
        onPress={update} />
}

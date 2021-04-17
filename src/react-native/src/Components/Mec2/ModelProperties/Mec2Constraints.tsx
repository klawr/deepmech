import { INode } from "mec2-module";
import React from "react";
import Accordion from "../../Utils/Accordion";
import ModalSelect from "../../Utils/ModalSelect";
import Mec2Table from "../Utils/Mec2Table";
import Mec2TextCell from "../Utils/Mec2TextCell";
import { IMec2Cell } from "../Utils/Mec2Cell";
import Mec2AddElement from "./Mec2AddElement";
import { useSelector } from "react-redux";
import { mecModelSelectModel } from "../../../Redux/MecModelSlice";

export default function Mec2Constraints() {
    const args: IMec2Cell = {
        name: 'constraints',
        mec2cell: {
            id: (args: any) => <Mec2TextCell {...args} />,
            p1: (args: any) => <PointSelect {...args} />,
            p2: (args: any) => <PointSelect {...args} />,
            len: (args: any) => <TypeSelect {...args} />,
            ori: (args: any) => <TypeSelect {...args} />,
        },
    };

    const head = ['id', 'p1', 'p2', 'len', 'ori'];

    return <Accordion title={args.name}>
        <Mec2Table args={args} head={head} />
        <Mec2AddElement args={args} text="Add constraint" />
    </Accordion>
}

function TypeSelect({ property, elm, update }: any) {
    const selected = elm[property]?.type || 'free';

    return <ModalSelect
        selected={selected}
        options={['free', 'const', 'drive'].filter(e => e !== selected)}
        header={`Select ${property} type of constraint ${elm.id}`}
        onPress={(e: string) => update({ type: e })} />
}

function PointSelect({ property, elm, update }: any) {
    const model = useSelector(mecModelSelectModel);
    return <ModalSelect
        selected={elm[property]}
        options={model.nodes
            .map((e: INode) => e.id)
            .filter((e: string) => e !== elm[property])}
        header={`Select ${property} of constraint ${elm.id}`}
        onPress={update} />
}

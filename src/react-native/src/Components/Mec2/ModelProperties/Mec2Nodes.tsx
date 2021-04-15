import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { mecModelSelect } from "../../../Redux/MecModelSlice";
import Accordion from "../../Utils/Accordion";
import Mec2BoolCell from "../Utils/Mec2BoolCell";
import Mec2Table from "../Utils/Mec2Table";
import Mec2TextCell from "../Utils/Mec2TextCell";
import getMec2Cell, { IMec2Cell } from "../Utils/Mec2Cell";
import Mec2AddElement from "./Mec2AddElement";
import { IModel } from "mec2-module";
import Mec2NumberCell from "../Utils/Mec2NumberCell";

export default function Mec2Nodes() {
    const args: IMec2Cell = {
        dispatch: useDispatch(),
        model: useSelector(mecModelSelect).model,
        name: 'nodes',
        mec2cell: {
            id: (args) => <Mec2TextCell {...args} />,
            x: (args) => <Mec2NumberCell {...args} />,
            y: (args) => <Mec2NumberCell {...args} />,
            base: (args) => <Mec2BoolCell {...args} />,
        },
    };

    const list = args.model[args.name as keyof IModel];
    const head = ['id', 'x', 'y', 'base'];

    return <Accordion title={args.name}>
        <Mec2Table list={list} head={head} Mec2Cell={getMec2Cell(args)} />
        <Mec2AddElement {...args} />
    </Accordion>
}

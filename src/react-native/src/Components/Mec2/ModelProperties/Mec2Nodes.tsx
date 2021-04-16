import React from "react";
import Accordion from "../../Utils/Accordion";
import Mec2BoolCell from "../Utils/Mec2BoolCell";
import Mec2Table from "../Utils/Mec2Table";
import Mec2TextCell from "../Utils/Mec2TextCell";
import Mec2AddElement from "./Mec2AddElement";
import Mec2NumberCell from "../Utils/Mec2NumberCell";
import { IMec2Cell } from "../Utils/Mec2Cell";

export default function Mec2Nodes() {
    const args: IMec2Cell = {
        name: 'nodes',
        mec2cell: {
            id: (args) => <Mec2TextCell {...args} />,
            x: (args) => <Mec2NumberCell {...args} />,
            y: (args) => <Mec2NumberCell {...args} />,
            base: (args) => <Mec2BoolCell {...args} />,
        },
    };

    const head = ['id', 'x', 'y', 'base'];

    return <Accordion title={args.name}>
        <Mec2Table args={args} head={head} />
        <Mec2AddElement args={args} text="Add node" />
    </Accordion>
}

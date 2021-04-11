import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { mecModelSelect } from "../../../Redux/MecModelSlice";
import Accordion from "../Utils/Accordion";
import Mec2Table from "../Utils/Mec2Table";
import Mec2AddNode from "./Add/Mec2AddNode";
import { Text } from 'react-native';

function SanitizedCell({ children }: { children: string }) {
    return <Text style={{ width: 100 }}>{children}</Text>;
}

export default function Mec2Nodes() {
    const dispatch = useDispatch();
    const model = useSelector(mecModelSelect);
    const list = model.model.nodes;

    const head = ['x', 'y', 'base', 'id'];

    return <Accordion title="Nodes">
        <Mec2Table list={list} head={head} SanitizedCell={SanitizedCell} />
        <Mec2AddNode />
    </Accordion>

}

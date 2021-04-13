import React from "react";
import { StyleSheet, Switch, TextInput, View } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { mecModelAction, mecModelSelect } from "../../../Redux/MecModelSlice";
import Accordion from "../../Utils/Accordion";
import Mec2BoolCell from "../Utils/Mec2BoolCell";
import Mec2Table from "../Utils/Mec2Table";
import Mec2TextCell from "../Utils/Mec2TextCell";
import Mec2AddNode from "./Add/Mec2AddNode";

export default function Mec2Nodes() {
    const dispatch = useDispatch();
    const model = useSelector(mecModelSelect);
    const name = "nodes";
    const list = model.model[name];

    const head = ['id', 'x', 'y', 'base'];

    return <Accordion title={name}>
        <Mec2Table list={list} head={head} SanitizedCell={getSanitizedCell(dispatch, name)} />
        <Mec2AddNode />
    </Accordion>
}

const sanitizedCell = {
    id: (args: any) => <Mec2TextCell {...args} />,
    x: (args: any) => <Mec2TextCell {...args} />,
    y: (args: any) => <Mec2TextCell {...args} />,
    base: (args: any) => <Mec2BoolCell {...args} />,
}

function getSanitizedCell(dispatch: any, name: string) {
    return function SanitizedCell({ property, idx, elm }: any) {
        function update(value: any, previous = elm[property]) {
            dispatch(mecModelAction.add({
                list: name, idx,
                value: { [property]: value },
                previous: { [property]: previous }
            }));
        }

        return (sanitizedCell as any)[property]({ property, elm, update });

        // TODO
        // function removeNode() {
        //     dispatch(mecModelAction.add({
        //         list: name, idx: 'remove',
        //         value: (({ id, x, y, base }) => ({ id, x, y, base }))(elm),
        //         previous: {}
        //     }));
        // }

        // return <ContextMenu key={idx}>
        //     {select()}
        //     <MenuItem onClick={removeNode}>
        //         {`Remove node ${elm['id']}`}
        //     </MenuItem>
        // </ContextMenu>
    }
}

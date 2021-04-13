import React from "react";
import { Platform, StyleSheet, Switch, View } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { mecModelAction, mecModelSelect } from "../../../Redux/MecModelSlice";
import Accordion from "../../Utils/Accordion";
import Mec2Table from "../Utils/Mec2Table";
import Mec2AddConstraint from "./Add/Mec2AddConstraint";
import { IMec2, INode } from "mec2-module";
import Mec2TextCell from "../Utils/Mec2TextCell";
import Mec2Cell from "../Utils/Mec2Cell";
import ModalSelect from "../../Utils/ModalSelect";

export default function Mec2Constraints() {
    const dispatch = useDispatch();
    const model = useSelector(mecModelSelect);
    const name = "constraints";
    const list = model.model[name];

    const head = ['id', 'p1', 'p2', 'len', 'ori'];

    return <Accordion title={name}>
        <Mec2Table list={list} head={head} SanitizedCell={getSanitizedCell(dispatch, name, model.model)} />
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

const sanitizedCell = {
    id: (args: any) => <Mec2TextCell {...args} />,
    p1: (args: any) => <PointSelect {...args} />,
    p2: (args: any) => <PointSelect {...args} />,
    len: (args: any) => <TypeSelect {...args} />,
    ori: (args: any) => <TypeSelect {...args} />,
}

function getSanitizedCell(dispatch: any, name: string, model: IMec2) {
    return function SanitizedCell({ property, idx, elm }: any) {
        function update(value: any, previous = elm[property]) {

            // Turn nodes around if same is picked
            const next = { [property]: value } as any;
            const prev = { [property]: previous } as any;

            if (property === 'p1' && value === elm.p2) {
                next.p2 = elm.p1;
                prev.p2 = elm.p2;
            } else if (
                property === 'p2' && value === elm.p1) {
                next.p1 = elm.p2;
                prev.p1 = elm.p1;
            }

            dispatch(mecModelAction.add({
                list: name, idx,
                value: next,
                previous: prev,
            }));
        }

        return (sanitizedCell as any)[property]({ property, elm, update, model });

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

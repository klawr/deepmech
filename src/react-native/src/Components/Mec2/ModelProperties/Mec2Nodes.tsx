import React from "react";
import { StyleSheet, Switch, TextInput, View } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { mecModelAction, mecModelSelect } from "../../../Redux/MecModelSlice";
import Accordion from "../../Utils/Accordion";
import Mec2Table from "../Utils/Mec2Table";
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

function getSanitizedCell(dispatch: any, name: string) {
    return function SanitizedCell({ property, idx, elm }: any) {
        function update(value: any, previous = elm[property]) {
            dispatch(mecModelAction.add({
                list: name, idx,
                value: { [property]: value },
                previous: { [property]: previous }
            }));
        }

        function select() {
            switch (property) {
                case 'base':
                    return <View style={styles.sanitizedCell}>
                        <Switch
                            value={elm[property]}
                            onValueChange={update} />
                    </View>
                case 'x':
                case 'y':
                    return <TextInput
                        style={styles.sanitizedCell}
                        value={`${elm[property]}`}
                        placeholder={property}
                        onChangeText={update} />
                case 'id':
                    return <TextInput
                        style={styles.sanitizedCell}
                        value={elm[property]}
                        placeholder={property}
                        onChangeText={update} />
                default: return <div>{elm[property]}</div>
            }
        }

        return select();

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

const styles = StyleSheet.create({
    sanitizedCell: {
        display: 'flex',
        flex: 1,
        alignItems: "center",
        alignContent: "center",
        width: 100,
    }
})


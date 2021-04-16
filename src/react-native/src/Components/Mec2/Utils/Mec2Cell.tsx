import { IConstraint, IMecPlugIns, IModel, INode, IView } from 'mec2-module';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { mecModelAction } from '../../../Redux/MecModelSlice';
export interface IMec2Cell {
    name: string,
    mec2cell: IMec2CellProperty,
}

export interface IMec2CellProperty {
    [key: string]: (args: IMec2CellPropertyArgs) => JSX.Element;
}

export interface MecElement extends INode, IView, IConstraint { };
export interface IMec2CellPropertyArgs {
    property: keyof MecElement,
    elm: MecElement,
    update: (args: any) => void,
}

export default function getMec2Cell({ name, mec2cell }: IMec2Cell) {
    const dispatch = useDispatch();
    return function Mec2Cell({ property, idx, elm }: any) {
        function update(value: any, previous = elm[property]) {
            dispatch(mecModelAction.add({
                list: name as keyof IMecPlugIns,
                idx,
                value: { [property]: value },
                previous: { [property]: previous }
            }));
        }
        return <View style={styles.mec2cell}>
            {mec2cell[property]({ property, elm, update })}
        </View>

    }
}

const styles = StyleSheet.create({
    mec2cell: {
        // display: 'flex',
        // flex: 1,
        alignItems: 'center',
        // alignContent: "center",
    }
});

import { IConstraint, IMecPlugIns, IModel, INode, IView } from 'mec2-module';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { mecModelAction } from '../../../Redux/MecModelSlice';
export interface IMec2Cell {
    dispatch: (args: any) => void,
    model: IModel,
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
    model: IModel,
}

function edgeCases({ name, elm, property, value, previous, model, dispatch }: any) {
    const next = { [property]: value } as any;
    const prev = { [property]: previous } as any;

    if (name === 'nodes') {
        if (property === 'id') {
            model.constraints.forEach((c: IConstraint, idx: number) => {
                if (c.p1 === previous) {
                    dispatch(mecModelAction.add({
                        list: 'constraints', idx, value: { p1: value }, previous: { p1: c.p1 }
                    }));
                }
                if (c.p2 === previous) {
                    dispatch(mecModelAction.add({
                        list: 'constraints', idx, value: { p2: value }, previous: { p1: c.p2 }
                    }));
                }
            })
        }
    }

    if (name === 'constraints') {
        if (property === 'p1' && value === elm.p2) {
            next.p2 = elm.p1;
            prev.p2 = elm.p2;
        } else if (
            property === 'p2' && value === elm.p1) {
            next.p1 = elm.p2;
            prev.p1 = elm.p1;
        }
    }

    return { next, prev };
}

export default function getMec2Cell({ dispatch, name, model, mec2cell }: IMec2Cell) {
    return function Mec2Cell({ property, idx, elm }: any) {
        function update(value: any, previous = elm[property]) {
            const { next, prev } = edgeCases({ name, elm, property, value, previous, model, dispatch });
            dispatch(mecModelAction.add({
                list: name as keyof IMecPlugIns,
                idx,
                value: next,
                previous: prev
            }));
        }
        return <View style={styles.mec2cell}>
            {mec2cell[property]({ property, elm, update, model })}
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

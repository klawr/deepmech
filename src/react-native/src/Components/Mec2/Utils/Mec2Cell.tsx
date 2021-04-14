import { IModel } from 'mec2-module';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { mecModelAction } from '../../../Redux/MecModelSlice';
export interface IMec2Cell {
    dispatch: () => void,
    model: IModel,
    name: string,
    mec2cell: {
        [property: string]: (args: any) => JSX.Element;
    }
}

function edgeCases({ name, elm, property, value, previous }: any) {
    const next = { [property]: value } as any;
    const prev = { [property]: previous } as any;

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

export default function getMec2Cell({ dispatch, name, model, mec2cell }: any) {
    return function Mec2Cell({ property, idx, elm }: any) {
        function update(value: any, previous = elm[property]) {
            const { next, prev } = edgeCases({ name, elm, property, value, previous });
            dispatch(mecModelAction.add({ list: name, idx, value: next, previous: prev }));
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

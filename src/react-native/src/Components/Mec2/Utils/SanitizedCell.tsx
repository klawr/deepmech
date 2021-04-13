import React from 'react';
import { StyleSheet, View } from 'react-native';
import { mecModelAction } from '../../../Redux/MecModelSlice';

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

export default function getSanitizedCell({ dispatch, name, model, sanitizedCell }: any) {
    return function SanitizedCell({ property, idx, elm }: any) {
        function update(value: any, previous = elm[property]) {
            const { next, prev } = edgeCases({ name, elm, property, value, previous });
            dispatch(mecModelAction.add({ list: name, idx, value: next, previous: prev }));
        }
        return <View style={styles.sanitizedCell}>
            {sanitizedCell[property]({ property, elm, update, model })}
        </View>

    }
}

const styles = StyleSheet.create({
    sanitizedCell: {
        // display: 'flex',
        // flex: 1,
        alignItems: 'center',
        // alignContent: "center",
    }
});

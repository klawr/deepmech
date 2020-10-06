import React from 'react';
import { Checkbox } from '@material-ui/core';
import { MecTable, handleMecUpdate, UpdateText } from '..';
import { useDispatch } from 'react-redux';
import { add } from '../../Features';

export default function Nodes() {
    const head = ['id', 'x', 'y', 'base'];
    const dispatch = useDispatch();

    function SanitizedCell({ prop, idx, elm }) {
        function update(
            value,
            list = 'nodes',
            i = idx,
            property = prop,
            previous = elm[prop]) {
            dispatch(add({ value, list, idx: i, property, previous }));
        }

        switch (prop) {
            case 'base':
                const [checked, changeChecked] = React.useState(!!elm[prop]);
                return <Checkbox
                    checked={checked}
                    onChange={(e) => {
                        changeChecked(e.target.checked)
                        update(e.target.checked)
                    }} />
            case 'x':
            case 'y':
                return <UpdateText
                    title={prop}
                    value={Math.round(elm[prop])}
                    onSubmit={v => update(+v)} />
            case 'id':
                return <UpdateText
                    title={prop}
                    value={elm[prop]}
                    onSubmit={update} />
            default: return <div>{elm[prop]}</div>
        }
    }

    return <MecTable
        SanitizedCell={SanitizedCell}
        head={head}
        list={mecElement._model.nodes} />
}
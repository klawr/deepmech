import React from 'react';
import { Checkbox } from '@material-ui/core';
import { MecTable, handleMecUpdate, UpdateText } from '..';
import { useDispatch } from 'react-redux';
import { add } from '../../Features';

export default function Nodes() {
    const head = ['id', 'x', 'y', 'base'];
    const dispatch = useDispatch();

    function SanitizedCell({ prop: property, idx, elm }) {
        function update(value, previous = elm[property]) {
            dispatch(add({ list: 'nodes', idx, property, value, previous }));
        }

        switch (property) {
            case 'base':
                const [checked, changeChecked] = React.useState(!!elm[property]);
                return <Checkbox
                    checked={checked}
                    onChange={(e) => {
                        changeChecked(e.target.checked)
                        update(e.target.checked)
                    }} />
            case 'x':
            case 'y':
                return <UpdateText
                    title={property}
                    value={Math.round(elm[property])}
                    onSubmit={v => update(+v)} />
            case 'id':
                return <UpdateText
                    title={property}
                    value={elm[property]}
                    onSubmit={update} />
            default: return <div>{elm[property]}</div>
        }
    }

    return <MecTable
        SanitizedCell={SanitizedCell}
        head={head}
        list={mecElement._model.nodes} />
}
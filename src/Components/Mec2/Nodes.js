import React from 'react';
import { Checkbox } from '@material-ui/core';
import { MecTable, handleMecUpdate, UpdateText } from '..';
import { useDispatch } from 'react-redux';
import { add } from '../../Features';

export default function Nodes() {
    const head = ['id', 'x', 'y', 'base'];
    const dispatch = useDispatch();

    function SanitizedCell({ prop, idx, elm }) {
        function update(value, list = 'nodes', i = idx, property = prop) {
            dispatch(add({ value, list, idx: i, property }));
        }

        switch (prop) {
            case 'base':
                return <Checkbox checked={!!elm[prop]} onChange={(e) => update(e.target.checked)} />
            case 'x':
            case 'y':
                return <UpdateText title={prop} value={elm[prop]} onSubmit={update} />
            case 'id':
                function propagateChange(newId) {
                    model.constraints.forEach((c, idx) => {
                        if (c.p1 === elm[prop]) update(newId, 'constraints', idx, 'p1');
                        if (c.p2 === elm[prop]) update(newId, 'constraints', idx, 'p1');
                    });
                    model.constraints.forEach((v, idx) => {
                        if (v.of === elm[prop]) update(newId, 'views', idx, 'of');
                    });
                }

                return <UpdateText title={prop} value={elm[prop]} onSubmit={(e) => {
                    propagateChange(e);
                    update(e);
                }} />
            default: return <div>{elm[prop]}</div>
        }
    }

    return <MecTable
        SanitizedCell={SanitizedCell}
        head={head}
        list={mecElement._model.nodes} />
}
import React from 'react';
import { MecTable, handleMecUpdate } from '..';
import { InputBase } from '@material-ui/core';

export default function Constraints({ mec2, head, elms }) {
    function SanitizedCell({ elm, prop }) {
        const constraint = mec2._model.constraintById(elm.id);

        function handleConstraintUpdate(fn) {
            return handleMecUpdate(mec2, constraint, prop, fn);
        }

        switch (prop) {
            case 'id':
                const [id, changeId] = handleConstraintUpdate();
                return <InputBase value={id} onChange={(e) => changeId(e.target.value)} />
            default:
                if (typeof elm[prop] === 'object') {
                    return <div> {JSON.stringify(elm[prop])} </div>
                }
                return <div>{elm[prop]}</div>
        }
    }

    return <MecTable SanitizedCell={SanitizedCell} head={head} list={elms} />
}
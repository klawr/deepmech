import React from 'react';
import { Checkbox, InputBase, } from '@material-ui/core';
import { MecTable, handleMecUpdate } from '..';

export default function Nodes({ mec2, head, elms }) {
    function SanitizedCell({ prop, elm }) {
        const node = mec2._model.nodeById(elm.id);

        function handleNodeUpdate(fn) {
            return handleMecUpdate(mec2, node, prop, fn);
        }

        switch (prop) {
            case 'base':
                const [checked, toggleCheck] = handleNodeUpdate();
                return <Checkbox
                    checked={checked}
                    onChange={(e) => toggleCheck(e.target.checked)} />
            case 'x':
            case 'y':
                const [value, changeValue] = handleNodeUpdate();
                return <InputBase
                    value={value}
                    onChange={(e) => changeValue(e.target.value)} />
            case 'id':
                function propagateChange(newId) {
                    mec2._model.constraints.forEach(c => {
                        if (c.p1 === id) c.p1 = newId;
                        if (c.p2 === id) c.p2 = newId;
                    });
                    mec2._model.views.forEach(v => {
                        if (v.of === id) v.of = newId;
                    });
                }

                const [id, changeId] = handleNodeUpdate(propagateChange);
                return <InputBase value={id} onChange={(e) => changeId(e.target.value)} />
            default: return <div>{elm[prop]}</div>
        }
    }

    return <MecTable SanitizedCell={SanitizedCell} head={head} list={elms} />
}
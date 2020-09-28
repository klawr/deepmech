import React from 'react';
import { Checkbox, InputBase, } from '@material-ui/core';
import { MecTable, handleMecUpdate, UpdateText } from '..';

export default function Nodes({ mec2, head, elms, updateModel }) {
    head.includes('base') || head.push('base');

    function SanitizedCell({ prop, elm }) {
        const node = mec2._model.nodeById(elm.id);

        function handleNodeUpdate(fn) {
            return handleMecUpdate(mec2, node, prop, updateModel, fn);
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
                return <UpdateText title={prop} value={value} onSubmit={changeValue} />
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
                return <UpdateText title={prop} value={id} onSubmit={changeId} />
            default: return <div>{elm[prop]}</div>
        }
    }

    return <MecTable SanitizedCell={SanitizedCell} head={head} list={elms} />
}
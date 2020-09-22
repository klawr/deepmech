import React from 'react';
import { Checkbox, } from '@material-ui/core';
import { MecTable } from '..';

export default function Nodes({ mec2, head, elms }) {
    function SanitizedCell({ prop, elm }) {
        const node = mec2._model.nodeById(elm.id);
        // Custom mec2 properties
        if (prop === 'base') {
            const [checked, toggleCheck] = React.useState(!!node.base);
            function handleChange(e) {
                toggleCheck(e.target.checked);
                node.base = e.target.checked;
                mec2.render();
            }
            return <Checkbox checked={checked} onChange={handleChange} />
        }

        if (typeof elm[prop] === "object") {
            return <div> {JSON.stringify(elm[prop])} </div>
        }
        else if (elm[prop] === undefined) {
            return <div />
        }
        else {
            return <div> {elm[prop]} </div>
        }
    }

    return <MecTable SanitizedCell={SanitizedCell} head={head} list={elms} />
}
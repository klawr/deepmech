import React from 'react';
import { Checkbox, InputBase, } from '@material-ui/core';
import { MecTable } from '..';

export default function Nodes({ mec2, head, elms }) {
    function SanitizedCell({ prop, elm }) {
        const node = mec2._model.nodeById(elm.id);

        function handleUpdate(ref, prop, def = ref[prop]) {
            const [val, changeVal] = React.useState(def);
            function handleChange(targetValue) {
                changeVal(targetValue);
                ref[prop] = targetValue;
                mec2._model.reset();
                mec2.render();
            };
    
            return [val, handleChange];
        }

        // Custom mec2 properties
        if (prop === 'base') {
            const [checked, toggleCheck] = handleUpdate(node, prop);
            return <Checkbox checked={checked} onChange={(e) => toggleCheck(e.target.checked)} />
        }

        if (prop === 'x' || prop === 'y') {
            const [value, changeValue] = handleUpdate(node, prop);
            return <InputBase value={value} onChange={(e) => changeValue(e.target.value)}/> 
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
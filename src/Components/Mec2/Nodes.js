import React from 'react';
import { Checkbox, } from '@material-ui/core';
import { MecTable } from '..';

export default function Nodes({head, elms}) {
    function SanitizedCell({prop, elm}) {
        // Custom mec2 properties
        if (prop === 'base') {
            return <Checkbox checked={!!elm[prop]}/>
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
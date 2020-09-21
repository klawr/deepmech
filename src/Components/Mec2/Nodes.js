import React from 'react';
import { Checkbox, } from '@material-ui/core';
import { MecTable } from '..';

export default function Nodes({head, elms}) {
    function SanitizedCell({title, value}) {
        // Custom mec2 properties
        if (title === "base") {
            return <Checkbox checked={!!value} />
        }

        if (typeof value === "object") {
            return <div> {JSON.stringify(value)} </div>
        }
        else if (value === undefined) {
            return <div />
        }
        else {
            return <div> {value} </div>
        }
    }

    return <MecTable
        SanitizedCell={SanitizedCell}
        head={head}
        list={elms} />
}
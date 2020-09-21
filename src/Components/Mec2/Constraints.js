import React from 'react';
import { MecTable } from '..';

export default function Constraints({head, elms}) {
    function SanitizedCell({value}) {
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
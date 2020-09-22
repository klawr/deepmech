import React from 'react';
import { MecTable } from '..';

export default function Constraints({head, elms}) {
    function SanitizedCell({elm, prop}) {
        if (typeof elm[prop] === "object") {
            return <div> {JSON.stringify(elm[prop])} </div>
        }
        else if (prop === undefined) {
            return <div />
        }
        else {
            return <div> {elm[prop]} </div>
        }
    }

    return <MecTable SanitizedCell={SanitizedCell} head={head} list={elms} />
}
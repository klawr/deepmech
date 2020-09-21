import React from 'react';

import MecTable from './MecTable';

export default function Views(props) {
    function SanitizedCell(props) {
        if (typeof props.value === "object") {
            return <div> {JSON.stringify(props.value)} </div>
        }
        else if (props.value === undefined) {
            return <div />
        }
        else {
            return <div> {props.value} </div>
        }
    }

    return <MecTable
        SanitizedCell={SanitizedCell}
        head={props.head}
        list={props.elms} />
}
import React from 'react';

import { Checkbox, } from '@material-ui/core';

import MecTable from './MecTable';

export default function Nodes(props) {
    function SanitizedCell(props) {
        // Custom mec2 properties
        if (props.title === "base") {
            return <Checkbox checked={!!props.value} />
        }

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
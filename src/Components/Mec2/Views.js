import React from 'react';
import { MecTable, RadioSelect } from '..';

export default function Views(props) {
    function SanitizedCell(props) {
        if (props.title === "as") {
            return <RadioSelect
                title={"as"}
                onChange={(prop) => console.log(prop)}
                selected={props.value}
                options={Object.keys(mec.view).filter(e => e !== "extend")} />
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
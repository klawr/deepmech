import React from 'react';
import { MecTable, RadioSelect } from '..';

export default function Views({head, elms}) {
    function SanitizedCell({title, value}) {
        if (title === "as") {
            return <RadioSelect
                title={"as"}
                onChange={(prop) => console.log(prop)}
                selected={value}
                options={Object.keys(mec.view).filter(e => e !== "extend")} />
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
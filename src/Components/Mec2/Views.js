import React from 'react';
import { MecTable, RadioSelect } from '..';

export default function Views({ head, elms }) {
    function SanitizedCell({ prop, elm }) {
        switch (prop) {
            case 'as':
                return <RadioSelect
                    title={"as"}
                    onChange={(p) => console.log(p)}
                    selected={elm[prop]}
                    options={Object.keys(mec.view).filter(e => e !== "extend")} />
            default:
                if (typeof elm[prop] === "object") {
                    return <div> {JSON.stringify(elm[prop])} </div>
                }
                return <div> {elm[prop]} </div>
        }
    }

    return <MecTable SanitizedCell={SanitizedCell} head={head} list={elms} />
}
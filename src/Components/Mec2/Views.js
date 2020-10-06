import React from 'react';
import { MecTable, RadioSelect, handleMecUpdate } from '..';
import { useDispatch } from 'react-redux';
import { add } from '../../Features';

export default function Views() {
    const head = ['show', 'of', 'as'];
    const dispatch = useDispatch();

    function SanitizedCell({ elm, idx, prop: property }) {

        function update(value, previous = elm[property]) {
            dispatch(add({ list: 'views', idx, property, value, previous }));
        }
        switch (property) {
            case 'show':
                return <RadioSelect
                    options={Object.keys(mec.aly)} // mec is the global mec object
                    onChange={update}
                    selected={elm[property]}
                    title={property} />
            case 'of':
                return <RadioSelect
                    options={model.nodes.map(n => n.id)}
                    onChange={(v) => update(v, elm[property].id)}
                    selected={elm[property].id}
                    title={property} />
            case 'as':
                return <RadioSelect
                    title={property}
                    onChange={update}
                    selected={elm[property]}
                    options={Object.keys(mec.view).filter(e => e !== "extend")} />
            default:
                if (typeof elm[property] === "object") {
                    return <div> {JSON.stringify(elm[property])} </div>
                }
                return <div> {elm[property]} </div>
        }
    }

    return <MecTable
        SanitizedCell={SanitizedCell}
        head={head}
        list={mecElement._model.views} />
}
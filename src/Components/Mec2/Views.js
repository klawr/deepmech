import React from 'react';
import { MecTable, RadioSelect, handleMecUpdate } from '..';
import { useDispatch } from 'react-redux';
import { add } from '../../Features';

export default function Views() {
    const head = ['show', 'of', 'as'];
    const dispatch = useDispatch();

    function SanitizedCell({ elm, idx, prop }) {

        function update(value) {
            dispatch(add({
                list: 'views',
                idx: idx,
                property: prop,
                value,
                previous: elm[prop],
            }));
        }

        switch (prop) {
            case 'show':
                return <RadioSelect
                    options={Object.keys(mec.aly)} // mec is the global mec object
                    onChange={update}
                    selected={elm[prop]}
                    title={prop} />
            case 'of':
                return <RadioSelect
                    options={model.nodes.map(n => n.id)}
                    onChange={update}
                    selected={elm[prop].id}
                    title={prop} />
            case 'as':
                return <RadioSelect
                    title={prop}
                    onChange={update}
                    selected={elm[prop]}
                    options={Object.keys(mec.view).filter(e => e !== "extend")} />
            default:
                if (typeof elm[prop] === "object") {
                    return <div> {JSON.stringify(elm[prop])} </div>
                }
                return <div> {elm[prop]} </div>
        }
    }

    return <MecTable
        SanitizedCell={SanitizedCell}
        head={head}
        list={mecElement._model.views} />
}
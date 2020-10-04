import React from 'react';
import {
    MecTable,
    RadioSelect,
    UpdateText,
    ObjectMenu
} from '..';
import { useDispatch } from 'react-redux';
import { add } from '../../Features';

export default function Constraints() {
    const head = ['id', 'p1', 'p2', 'len', 'ori'];
    const dispatch = useDispatch();

    function SanitizedCell({ elm, idx, prop }) {
        function update(value) {
            dispatch(add({
                list: 'constraints',
                idx: idx,
                property: prop,
                value: value,
                previous: elm[prop],
            }));
        };
        switch (prop) {
            case 'id': return <UpdateText title={prop} value={elm[prop]} onSubmit={update} />
            case 'p1':
            case 'p2':
                // const [p, changeP] = handleConstraintUpdate();
                return <RadioSelect
                    options={model.nodes.map(n => n.id)}
                    onChange={update}
                    selected={elm[prop].id}
                    title={prop} />
            case 'len':
            case 'ori':
                const proxy = elm[prop] || { type: 'free' };
                return <ObjectMenu label={prop} title={proxy.type}>
                    {Object.entries(proxy).map(e => {
                        switch (e[0]) {
                            case 'type':
                                return <RadioSelect key={e[0]}
                                    onChange={(t) => update({ ...elm[prop], [e[0]]: t })}
                                    title={e[0]}
                                    label={`${e[0]}: ${e[1]}`}
                                    selected={e[1]}
                                    options={['const', 'free', 'drive']} />
                            case 'ref':
                                return <RadioSelect key={e[0]}
                                    onChange={e => update(e.target.value)}
                                    title={e[0]}
                                    label={`${prop}: e[1]`}
                                    selected={e[1]}
                                    options={model.nodes.map(n => n.id)} />
                            default:
                                return <div>{e[0]}</div>
                        };
                    })}
                </ObjectMenu>
            default:
                if (typeof elm[prop] === 'object') {
                    return <div> {JSON.stringify(elm[prop])} </div>
                }
                return <div>{elm[prop]}</div>
        }
    }

    return <MecTable
        SanitizedCell={SanitizedCell}
        head={head}
        list={mecElement._model.constraints} />
}
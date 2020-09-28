import React from 'react';
import { MecTable, handleMecUpdate, RadioSelect, UpdateText, ObjectMenu } from '..';

export default function Constraints({ mec2, elms, updateModel }) {
    const head = ['id', 'p1', 'p2', 'len', 'ori'];

    function SanitizedCell({ elm, prop }) {
        const constraint = mec2._model.constraintById(elm.id);

        function handleConstraintUpdate(fn) {
            return handleMecUpdate(mec2, constraint, prop, updateModel, fn);
        }

        switch (prop) {
            case 'id':
                const [id, changeId] = handleConstraintUpdate();
                return <UpdateText title={prop} value={id} onSubmit={changeId} />
            case 'p1':
            case 'p2':
                const [p, changeP] = handleConstraintUpdate();
                return <RadioSelect
                    options={mec2._model.nodes.map(n => n.id)}
                    onChange={(val) => changeP(mec2._model.nodeById(val))}
                    selected={p.id}
                    title={prop} />
            case 'len':
            case 'ori':
                elm[prop] = elm[prop] || { type: 'free' };
                const [obj, changeObj] = handleConstraintUpdate();
                return <ObjectMenu label={prop} title={elm[prop].type}>
                    {Object.entries(obj).map(e => {
                        switch (e[0]) {
                            case 'type':
                                return <RadioSelect key={e[0]}
                                    onChange={(t) => changeObj({ ...obj, [e[0]]: t })}
                                    title={e[0]}
                                    label={`${e[0]}: ${e[1]}`}
                                    selected={e[1]}
                                    options={['const', 'free', 'drive']} />
                            case 'ref':
                                return <RadioSelect key={e[0]}
                                    onChange={e => changeObj(e.target.value)}
                                    title={e[0]}
                                    label={`${prop}: e[1]`}
                                    selected={e[1]}
                                    options={mec2._model.nodes.map(n => n.id)} />
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

    return <MecTable SanitizedCell={SanitizedCell} head={head} list={elms} />
}
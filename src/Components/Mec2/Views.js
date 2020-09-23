import React from 'react';
import { MecTable, RadioSelect, handleMecUpdate } from '..';

export default function Views({ mec2, head, elms, updateModel }) {
    function SanitizedCell({ elm, prop }) {
        function handleViewsUpdate(fn) {
            return handleMecUpdate(mec2, view, prop, updateModel, fn);
        }

        function viewBySimilarity() {
            return mec2._model.views.filter(v =>
                v.show === elm.show &&
                v.of.id === elm.of &&
                v.as === elm.as)[0];
        }

        const view = elm.id && mec2._model.viewById(elm.id) ||
            viewBySimilarity();

        switch (prop) {
            case 'show':
                const [show, changeShow] = handleViewsUpdate();
                return <RadioSelect
                    options={Object.keys(mec.aly)} // mec is the global mec object
                    onChange={(val) => changeShow(val)}
                    selected={show}
                    title={prop} />
            case 'of':
                const [of, changeOf] = handleViewsUpdate();
                return <RadioSelect
                    options={mec2._model.nodes.map(n => n.id)}
                    onChange={(val) => changeOf(mec2._model.nodeById(val))}
                    selected={of.id}
                    title={prop} />
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
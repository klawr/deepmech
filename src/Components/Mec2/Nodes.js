import React from 'react';
import { Checkbox } from '@material-ui/core';
import { MecTable, UpdateText } from '..';
import { useDispatch } from 'react-redux';
import { add } from '../../Features';

export default function Nodes() {
    const head = ['id', 'x', 'y', 'base'];
    const dispatch = useDispatch();

    React.useEffect(() => {
        let previous;
        let value;
        let selection;
        function deepmechNodeUp() {
            if (!value) return;
            const list = 'nodes';
            const idx = mecElement._model.nodes.indexOf(selection);
            dispatch(add({
                list, idx, property: 'x', value: value.x, previous: previous.x
            }));
            dispatch(add({
                list, idx, property: 'y', value: value.y, previous: previous.y
            }));
            previous = undefined;
            value = undefined;
        }

        function deepmechNodeDrag(e) {
            selection = mecElement._selector.selection;
            if (selection && selection.drag) {
                previous = previous || { x: e.xusr, y: e.yusr };
                value = { x: e.xusr, y: e.yusr }
            }
        }

        mecElement._interactor.on('drag', deepmechNodeDrag);
        mecElement._interactor.on('pointerup', deepmechNodeUp);

        return () => {
            mecElement._interactor.remove('drag', deepmechNodeDrag);
            mecElement._interactor.remove('pointerup', deepmechNodeUp);
        }
    });
    // store.subscribe(handleMecModelUpdate);

    function SanitizedCell({ prop: property, idx, elm }) {
        function update(value, previous = elm[property]) {
            dispatch(add({ list: 'nodes', idx, property, value, previous }));
        }

        switch (property) {
            case 'base':
                const [checked, changeChecked] = React.useState(!!elm[property]);
                return <Checkbox
                    checked={checked}
                    onChange={(e) => {
                        changeChecked(e.target.checked)
                        update(e.target.checked)
                    }} />
            case 'x':
            case 'y':
                return <UpdateText
                    title={property}
                    value={Math.round(elm[property])}
                    onSubmit={v => update(+v)} />
            case 'id':
                return <UpdateText
                    title={property}
                    value={elm[property]}
                    onSubmit={update} />
            default: return <div>{elm[property]}</div>
        }
    }

    return <MecTable
        SanitizedCell={SanitizedCell}
        head={head}
        list={mecElement._model.nodes} />
}
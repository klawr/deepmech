import React from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Checkbox,
} from '@material-ui/core';
import { MecTable, UpdateText } from '..';
import { useDispatch } from 'react-redux';
import { mecAction } from '../../Features';

export default function Nodes() {
    const head = ['id', 'x', 'y', 'base'];
    const dispatch = useDispatch();

    React.useEffect(() => {
        let previous;
        let value;
        let selection;

        function deepmechNodeDown(e) {
            selection = mecElement._selector.selection;
            previous = { x: selection.x, y: selection.y };
        }

        function deepmechNodeDrag(e) {
            if (selection && selection.drag) {
                value = { x: selection.x, y: selection.y }
            }
        }

        function deepmechNodeUp() {
            if (!value) {
                previous = undefined;
                return;
            }
            dispatch(add({
                list: 'nodes', idx: mecElement._model.nodes.indexOf(selection),
                value: { ...value }, previous: { ...previous }
            }));
        }

        const o = {
            pointerdown: deepmechNodeDown,
            drag: deepmechNodeDrag,
            pointerup: deepmechNodeUp,
        }

        Object.entries(o).forEach(e => mecElement._interactor.on(...e))

        return () => {
            Object.entries(o).forEach(e => mecElement._interactor.remove(...e));
        }
    });

    function SanitizedCell({ property, idx, elm }) {
        function update(value, previous = elm[property]) {
            dispatch(mecAction.add({
                list: 'nodes', idx,
                value: { [property]: value },
                previous: { [property]: previous }
            }));
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

    return <Accordion>
        <AccordionSummary> nodes </AccordionSummary>
        <AccordionDetails>
            <MecTable
                SanitizedCell={SanitizedCell}
                head={head}
                list={mecElement._model.nodes} />
        </AccordionDetails>
    </Accordion>
}
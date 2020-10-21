import React from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Checkbox,
    Grid,
} from '@material-ui/core';
import { MecTable, UpdateText, MultiSelect } from '..';
import { useDispatch, useSelector } from 'react-redux';
import { mecAction, UiAction, UiSelect } from '../../Features';

export default function Nodes() {
    const name = 'nodes';
    const dispatch = useDispatch();
    const head = useSelector(UiSelect).properties[name];
    function updateHead(e, arg) {
        dispatch(UiAction.updateProperty({
            property: name,
            label: arg,
            value: e.target.checked,
        }));
    }

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
                list: name, idx: mecElement._model[name].indexOf(selection),
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
                list: name, idx,
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
        <AccordionSummary> {name} </AccordionSummary>
        <AccordionDetails>
            <Grid container direction="row">
                <MultiSelect options={head} updateOptions={updateHead}/>
                <MecTable
                    SanitizedCell={SanitizedCell}
                    head={Object.entries(head).filter(h => h[1]).map(h => h[0])}
                    list={mecElement._model[name]} />
            </Grid>
        </AccordionDetails>
    </Accordion>
}
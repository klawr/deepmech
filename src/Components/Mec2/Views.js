import React from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Grid,
} from '@material-ui/core';
import { MecTable, RadioSelect, MultiSelect } from '..';
import { useDispatch, useSelector } from 'react-redux';
import { mecAction, UiAction, UiSelect } from '../../Features';

export default function Views() {
    const name = 'views';
    const dispatch = useDispatch();
    const head = useSelector(UiSelect).properties[name];
    function updateHead(e, arg) {
        dispatch(UiAction.updateProperty({
            property: name,
            label: arg,
            value: e.target.checked,
        }));
    }

    function SanitizedCell({ elm, idx, property }) {

        function update(value, previous = elm[property]) {
            dispatch(mecAction.add({
                list: name, idx,
                value: { [property]: value },
                previous: { [property]: previous }
            }));
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

    return <Accordion>
        <AccordionSummary> {name} </AccordionSummary>
        <AccordionDetails>
            <Grid container direction="row">
                <MultiSelect options={head} updateOptions={updateHead} />
                <MecTable
                    SanitizedCell={SanitizedCell}
                    head={Object.entries(head).filter(h => h[1]).map(h => h[0])}
                    list={mecElement._model[name]} />
            </Grid>
        </AccordionDetails>
    </Accordion>
}
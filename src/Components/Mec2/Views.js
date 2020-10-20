import React from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Grid,
} from '@material-ui/core';
import { MecTable, RadioSelect, handleMecUpdate } from '..';
import { useDispatch } from 'react-redux';
import { mecAction } from '../../Features';
import MultiSelect from '../Utils/MultiSelect';

export default function Views() {
    const [head, updateHead] = React.useState({
        show: true,
        of: true,
        as: true,
    });
    const dispatch = useDispatch();

    function SanitizedCell({ elm, idx, property }) {

        function update(value, previous = elm[property]) {
            dispatch(mecAction.add({
                list: 'views', idx,
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
        <AccordionSummary> views </AccordionSummary>
        <AccordionDetails>
            <Grid container direction="row">
                <MultiSelect options={head} updateOptions={updateHead} />
                <MecTable
                    SanitizedCell={SanitizedCell}
                    head={Object.entries(head).filter(h => h[1]).map(h => h[0])}
                    list={mecElement._model.views} />
            </Grid>
        </AccordionDetails>
    </Accordion>
}
import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core';
import { Id, Nodes, Constraints, Views } from '..';

export default function MecProperties({ classes, mec2, model, updateModel }) {
    function Acc(elm, title) {
        return <Accordion>
            <AccordionSummary> {title} </AccordionSummary>
            <AccordionDetails> {elm} </AccordionDetails>
        </Accordion>
    }

    function getProps(arr) {
        const props = new Set();
        arr.forEach(p => Object.keys(p).forEach(k => props.add(k)));
        return Array.from(props);
    }

    return <div>
        <Id classes={classes} mec2={mec2} />
        {Acc(<Nodes
            head={getProps(model.nodes)}
            updateModel={updateModel}
            elms={model.nodes}
            mec2={mec2} />, 'nodes')}
        {Acc(<Constraints
            head={getProps(model.constraints)}
            updateModel={updateModel}
            elms={model.constraints}
            mec2={mec2} />, 'constraints')}
        {Acc(<Views
            head={getProps(model.views)}
            updateModel={updateModel}
            elms={model.views}
            mec2={mec2} />, 'views')}
    </div>
}

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

    return <div>
        <Id classes={classes} mec2={mec2} />
        {Acc(<Nodes
            updateModel={updateModel}
            elms={model.nodes}
            mec2={mec2} />, 'nodes')}
        {Acc(<Constraints
            updateModel={updateModel}
            elms={model.constraints}
            mec2={mec2} />, 'constraints')}
        {Acc(<Views
            updateModel={updateModel}
            elms={model.views}
            mec2={mec2} />, 'views')}
    </div>
}

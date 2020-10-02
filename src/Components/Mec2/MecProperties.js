import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core';
import { Id, Nodes, Constraints, Views } from '..';

export default function MecProperties({ classes, mec2 }) {

    function Acc(elm, title) {
        return <Accordion>
            <AccordionSummary> {title} </AccordionSummary>
            <AccordionDetails> {elm} </AccordionDetails>
        </Accordion>
    }

    return <div>
        <Id classes={classes} mec2={mec2} />
        {Acc(<Nodes />, 'nodes')}
        {Acc(<Constraints />, 'constraints')}
        {Acc(<Views />, 'views')}
    </div>
}

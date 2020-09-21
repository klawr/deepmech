import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core';
import { Id, Nodes, Constraints, Views } from '..';

export default function MecProperties({ classes, prop, value }) {
    function Acc(elm) {
        return <Accordion>
            <AccordionSummary> {prop} </AccordionSummary>
            <AccordionDetails> {elm} </AccordionDetails>
        </Accordion>
    }

    function getProps() {
        const props = new Set();
        value.forEach(p => Object.keys(p).forEach(k => props.add(k)));
        return Array.from(props);
    }

    switch (prop) {
        case 'id':
            return <Id classes={classes} id={value} />;
        case 'nodes':
            return Acc(<Nodes head={getProps()} elms={value} />);
        case 'constraints':
            return Acc(<Constraints head={getProps()} elms={value} />);
        case 'views':
            return Acc(<Views head={getProps()} elms={value} />);
        case 'gravity':
            return <div />;
        default: {
            console.warn(`mec2 property ${prop} has no corresponding component...`)
            return <div />;
        }
    };
}

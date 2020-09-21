import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core';
import { Id, Nodes, Constraints, Views } from '..';

export default function MecProperties({list}) {
    function Acc(elm) {
        return <Accordion>
            <AccordionSummary> {list[0]} </AccordionSummary>
            <AccordionDetails> {elm} </AccordionDetails>
        </Accordion>
    }

    let head;
    if (Array.isArray(list[1])) {
        const props = new Set();
        list[1].forEach(p => Object.keys(p).forEach(k => props.add(k)));
        head = Array.from(props);
    }

    switch (list[0]) {
        case 'id':
            return <Id classes={classes} id={list[1]} />;
        case 'nodes':
            return Acc(<Nodes head={head} elms={list[1]} />);
        case 'constraints':
            return Acc(<Constraints head={head} elms={list[1]} />);
        case 'views':
            return Acc(<Views head={head} elms={list[1]} />);
        case 'gravity':
            return <div />;
        default: {
            console.warn(`mec2 property ${list[0]} has no corresponding component...`)
            return <div />;
        }
    };
}

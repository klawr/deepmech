import React from 'react';

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
} from '@material-ui/core';

import {
    Id,
    Nodes,
    Constraints,
    Views,
} from '..';

export default function MecProperties(props) {
    function Acc(elm) {
        return <Accordion>
            <AccordionSummary> {props.list[0]} </AccordionSummary>
            <AccordionDetails> {elm} </AccordionDetails>
        </Accordion>
    }

    let head;
    let elms;
    if (Array.isArray(props.list[1])) {
        const properties = new Set();
        props.list[1].forEach(p => Object.keys(p).forEach(k => properties.add(k)));
        elms = props.list[1];
        head = Array.from(properties);
    }

    switch (props.list[0]) {
        case 'id':
            return <Id classes={props.classes} list={props.list} />;
        case 'nodes':
            return Acc(<Nodes head={head} elms={elms} />);
        case 'constraints':
            return Acc(<Constraints head={head} elms={elms} />);
        case 'views':
            return Acc(<Views head={head} elms={elms} />);
        case 'gravity':
            return <div />;
        default: {
            console.warn(`mec2 property ${props.list[0]} has no corresponding component...`)
            return <div />;
        }
    };
}

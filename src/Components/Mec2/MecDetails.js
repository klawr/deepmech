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

export default function MecDetails(props) {
    function MecElement() {
        const properties = new Set();
        props.list[1].forEach && props.list[1].forEach(p => Object.keys(p).forEach(k => properties.add(k)));
        const head = Array.from(properties);
        const elms = props.list[1];


        switch (props.list[0]) {
            case 'nodes': return <Nodes head={head} elms={elms} />
            case 'constraints': return <Constraints head={head} elms={elms} />
            case 'views': return <Views head={head} elms={elms} />
            default: {
                console.warn(`mec2 property ${props.list[0]} has no corresponding component...`)
                return <div />;
            }
        };
    }

    if (props.list[0] === 'id') {
        return <Id classes={props.classes} list={props.list} />
    }
    else {
        return <Accordion>
            <AccordionSummary> {props.list[0]} </AccordionSummary>
            <AccordionDetails> <MecElement /> </AccordionDetails>
        </Accordion>
    }
}

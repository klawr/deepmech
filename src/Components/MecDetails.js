import React from 'react';

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Grid,
    ListItem,
    Typography
} from '@material-ui/core';

import MecTable from './MecTable'

export default function MecDetails(props) {
    if (typeof props.list[1] === 'string') {
        return <ListItem>
            <Grid container direction='row'>
                <div> {props.list[0]} </div>
                <div className={props.classes.right}> {props.list[1]} </div>
            </Grid>
        </ListItem>
    }
    else {
        return <Accordion>
            <AccordionSummary>
                {props.list[0]}
            </AccordionSummary>
            <AccordionDetails>
                <MecTable list={props.list[1]} />
            </AccordionDetails>
        </Accordion>
    }
}

import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Grid } from '@material-ui/core';
import { Id, Nodes, Constraints, Views, UndoRedo } from '..';
import { store } from '../../Features';

export default function MecProperties({ classes }) {
    const [, updateState] = React.useState();
    // TODO Check if change is related to Model? ...
    React.useEffect(() => store.subscribe(() => updateState({})));

    return <div>
        <Grid container direction="row">
            <Id />
            <UndoRedo classes={classes} />
        </Grid>
        <Nodes />
        <Constraints />
        <Views />
    </div>
}

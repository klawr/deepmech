import React from 'react';
import { Grid } from '@material-ui/core';
import { Id, Nodes, Constraints, Views, UndoRedo } from '..';

export default function MecProperties({ classes }) {
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

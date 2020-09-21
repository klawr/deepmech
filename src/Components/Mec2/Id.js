import React from 'react';
import { Grid, ListItem } from '@material-ui/core';

export default function Id({id, classes}) {
    return <ListItem>
        <Grid container direction='row'>
            <div> Id </div>
            <div className={classes.right}> {id} </div>
        </Grid>
    </ListItem>
}
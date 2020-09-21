import React from 'react';

import {
    Grid,
    ListItem,
} from '@material-ui/core';

export default function Id(props) {
    return <ListItem>
        <Grid container direction='row'>
            <div> {props.list[0]} </div>
            <div className={props.classes.right}> {props.list[1]} </div>
        </Grid>
    </ListItem>
}
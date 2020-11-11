import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { mecAction, mecSelect } from '../../Features';
import { ListButton } from '..';
import { Redo, Undo } from '@material-ui/icons';
import { Grid } from '@material-ui/core';

export default function UndoRedo({ classes }) {
    const dispatch = useDispatch();
    const mec = useSelector(mecSelect);

    return <Grid
        style={{ position: 'absolute', pointerEvents: 'none' }}
        container
        direction="row">
        <ListButton
            className={classes.right}
            tooltip="Undo"
            enabled={mec.selected > 0}
            onClick={() => dispatch(mecAction.undo())}>
            <Undo />
        </ListButton>
        <ListButton
            tooltip="Redo"
            enabled={mec.selected < mec.queue.length}
            onClick={() => dispatch(mecAction.redo())}>
            <Redo />
        </ListButton>
    </Grid>

}

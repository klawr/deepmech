  
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { mecModelAction, mecModelSelect } from '../../Redux/MecModelSlice';
import ListButton from '../Utils/ListButton';
import { Redo, Undo } from '@material-ui/icons';
import { Grid } from '@material-ui/core';

export default function Mec2UndoRedo() {
    const dispatch = useDispatch();
    const mecModel = useSelector(mecModelSelect);

    return <Grid
        style={{ position: 'absolute', pointerEvents: 'none' }}
        container
        direction="row">
        <ListButton
            tooltip="Undo"
            enabled={mecModel.selected > 0}
            onClick={() => dispatch(mecModelAction.undo())}>
            <Undo />
        </ListButton>
        <ListButton
            tooltip="Redo"
            enabled={mecModel.selected < mecModel.queue.length}
            onClick={() => dispatch(mecModelAction.redo())}>
            <Redo />
        </ListButton>
    </Grid>

}
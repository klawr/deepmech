import React from 'react';
import { useDispatch } from 'react-redux';
import { undo, redo, store } from '../../Features';
import { ListButton } from '..';
import { Redo, Undo } from '@material-ui/icons';
import { Grid } from '@material-ui/core';

export default function UndoRedo({ classes }) {
    const dispatch = useDispatch();

    // NOTE we assume to start with a clean MecModel.queue:
    const [undoEnabled, changeUndoEnabled] = React.useState(false);
    const [redoEnabled, changeRedoEnabled] = React.useState(false);

    React.useEffect(() => store.subscribe(() => {
        // TODO Check if change is related to Model? ...
        const m = store.getState().MecModel;
        changeUndoEnabled(m.selected > 0);
        changeRedoEnabled(m.selected < m.queue.length);
    }));

    return <Grid style={{ position: 'absolute' }} container direction="row">
        <ListButton
            className={classes.right}
            tooltip="Undo"
            enabled={undoEnabled}
            onClick={() => dispatch(undo())}>
            <Undo />
        </ListButton>
        <ListButton
            tooltip="Redo"
            enabled={redoEnabled}
            onClick={() => dispatch(redo())}>
            <Redo />
        </ListButton>
    </Grid>

}

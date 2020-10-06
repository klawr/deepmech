import React from 'react';
import { useDispatch } from 'react-redux';
import { undo, redo, store } from '../../Features';
import { ListButton } from '..';
import { Redo, Undo } from '@material-ui/icons';
import { Grid } from '@material-ui/core';

export default function UndoRedo({ classes }) {
    const dispatch = useDispatch();

    const [undoEnabled, changeUndoEnabled] = React.useState(false);
    const [redoEnabled, changeRedoEnabled] = React.useState(false);

    function monitorChange() {
        // Check if change is related to Model? ...
        const m = store.getState().MecModel;
        const s = m.selected;
        changeUndoEnabled(s > 0);
        changeRedoEnabled(s < m.queue.length);
    }
    React.useEffect(() => store.subscribe(monitorChange));


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

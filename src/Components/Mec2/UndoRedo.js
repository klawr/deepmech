import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { actionMec, selectMec, store } from '../../Features';
import { ListButton } from '..';
import { Redo, Undo } from '@material-ui/icons';
import { Grid } from '@material-ui/core';

export default function UndoRedo({ classes }) {
    const dispatch = useDispatch();
    const mec = useSelector(selectMec);

    const [undoEnabled, changeUndoEnabled] = React.useState(mec.selected > 0);
    const [redoEnabled, changeRedoEnabled] = React.useState(mec.selected > mec.queue.length);

    React.useEffect(() => store.subscribe(() => {
        // TODO Check if change is related to Model? ...
        const m = store.getState().MecModel;
        changeUndoEnabled(m.selected > 0);
        changeRedoEnabled(m.selected < m.queue.length);
    }));

    return <Grid
        style={{ position: 'absolute', pointerEvents: 'none' }}
        container
        direction="row">
        <ListButton
            className={classes.right}
            tooltip="Undo"
            enabled={undoEnabled}
            onClick={() => dispatch(actionMec.undo())}>
            <Undo />
        </ListButton>
        <ListButton
            tooltip="Redo"
            enabled={redoEnabled}
            onClick={() => dispatch(actionMec.redo())}>
            <Redo />
        </ListButton>
    </Grid>

}

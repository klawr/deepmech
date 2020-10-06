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

    let selected = 0;
    function monitorChange() {
        const m = store.getState().MecModel;
        const q = m.queue;
        const s = m.selected;
        if (selected === s) return;
        changeUndoEnabled(s > 0);
        // changeRedoEnabled(s < q.length);

        selected = s;
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
        {/* <ListButton
            tooltip="Redo"
            enabled={redoEnabled}
            onClick={() => dispatch(redo())}>
            <Redo />
        </ListButton> */}
    </Grid>

}

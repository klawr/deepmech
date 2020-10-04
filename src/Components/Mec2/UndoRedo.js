import React from 'react';
import { useSelector } from 'react-redux';
import { selectQueue, store } from '../../Features';
import { ListButton } from '..';
import { Redo, Undo } from '@material-ui/icons';
import { Grid } from '@material-ui/core';

export default function UndoRedo({ classes }) {
    const q = useSelector(selectQueue);

    const [undoEnabled, changeUndoEnabled] = React.useState(!!q.length);
    const [redoEnabled, changeRedoEnabled] = React.useState(false);

    function act(a, val) {
        mecElement._model[a.list][a.idx][a.property] = a[val];
        mecElement._model.preview();
        mecElement._model.pose();
        mecElement.render();
    }

    const undo = () => {
        console.log('TODO');
    }

    const redo = () => {
        console.log('TODO');
    }

    return <Grid style={{ position: 'absolute' }} container direction="row">
            <ListButton
                className={classes.right}
                tooltip="Undo"
                enabled={undoEnabled}
                onClick={undo}>
                <Undo />
            </ListButton>
            <ListButton
                tooltip="Redo"
                enabled={redoEnabled}
                onClick={redo}>
                <Redo />
            </ListButton>
    </Grid>

}

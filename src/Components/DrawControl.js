import React from 'react';
import clsx from 'clsx';
import { List } from '@material-ui/core';
import { Create, RotateLeft } from '@material-ui/icons';
import { ListButton } from '.';

export default function DrawControl({classes, state, toggleState}) {
    const toggleDrawMode = () => {
        toggleState({ ...state, drawing: !state.drawing });
    };

    return <List>
        <ListButton
            onClick={toggleDrawMode}
            tooltip={(state.drawing ? "Exit" : "Activate") + " draw mode"}>
            <Create className={clsx({
                [classes.hide]: state.drawing
            })} />
            <RotateLeft className={clsx({
                [classes.hide]: !state.drawing
            })} />
        </ListButton>
    </List>
}
import React from 'react';
import clsx from 'clsx';
import { List } from '@material-ui/core';
import { Create, RotateLeft } from '@material-ui/icons';
import { ListButton } from '.';

export default function DrawControl(props) {
    const toggleDrawMode = () => {
        props.toggleState({ ...props.state, drawing: !props.state.drawing });
    };

    return <List>
        <ListButton
            onClick={toggleDrawMode}
            tooltip={(props.state.drawing ? "Exit" : "Activate") + " draw mode"}>
            <Create className={clsx({
                [props.classes.hide]: props.state.drawing
            })} />
            <RotateLeft className={clsx({
                [props.classes.hide]: !props.state.drawing
            })} />
        </ListButton>
    </List>
}
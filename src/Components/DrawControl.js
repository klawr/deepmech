import React from 'react';
import clsx from 'clsx';

import { List } from '@material-ui/core';

import {
    Create as CreateIcon,
    RotateLeft as RotateLeftIcon,
} from '@material-ui/icons';

import ListButton from './ListButton';

export default function DrawControl(props) {
    const toggleDrawMode = () => {
        props.toggleState({ ...props.state, drawing: !props.state.drawing });
    };

    return <List>
        <ListButton
            onClick={toggleDrawMode}
            tooltip={(props.state.drawing ? "Exit" : "Activate") + " draw mode"}>
            <CreateIcon className={clsx({
                [props.classes.hide]: props.state.drawing
            })} />
            <RotateLeftIcon className={clsx({
                [props.classes.hide]: !props.state.drawing
            })} />
        </ListButton>
    </List>
}
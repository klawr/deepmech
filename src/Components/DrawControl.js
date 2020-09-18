import React from 'react';
import clsx from 'clsx';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import CreateIcon from '@material-ui/icons/Create';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';

import Button from './Button';

export default function DrawControl(props) {
    const toggleDrawMode = () => {
        props.toggleState({ ...props.state, drawing: !props.state.drawing });
    };

    return <List>
        <ListItem>
            <Button
                onClick={toggleDrawMode}
                tooltip={(props.state.drawing ? "Exit" : "Activate") + " draw mode"}>
                <CreateIcon className={clsx({
                    [props.classes.hide]: props.state.drawing
                })} />
                <RotateLeftIcon className={clsx({
                    [props.classes.hide]: !props.state.drawing
                })} />
            </Button>
        </ListItem>
    </List>
}
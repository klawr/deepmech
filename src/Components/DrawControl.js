import React from 'react';
import clsx from 'clsx';

import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import CreateIcon from '@material-ui/icons/Create';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';

export default function DrawControl(props) {
    const toggleDrawMode = () => {
        props.toggleState({ ...props.state, drawing: !props.state.drawing });
    };

    return <List>
        <ListItem>
            <IconButton onClick={toggleDrawMode}>
                <CreateIcon className={clsx({
                    [props.classes.hide]: props.state.drawing
                })} />
                <RotateLeftIcon className={clsx({
                    [props.classes.hide]: !props.state.drawing
                })} />
            </IconButton>
        </ListItem>
    </List>
}
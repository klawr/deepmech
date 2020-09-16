import React from 'react';
import clsx from 'clsx';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import CreateIcon from '@material-ui/icons/Create';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';

export function DrawControl(props) {
    const toggleDrawMode = () => {
        props.toggleState({ ...props.state, drawing: !props.state.drawing });
    }

    return <List>
        <ListItem onClick={toggleDrawMode}>
            <CreateIcon className={clsx({ [props.classes.hide]: props.state.drawing })} />
            <RotateLeftIcon className={clsx({ [props.classes.hide]: !props.state.drawing })} />
        </ListItem>
    </List>
}
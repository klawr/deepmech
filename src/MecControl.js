import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ClearIcon from '@material-ui/icons/Clear';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';

export function MecControl(props) {
    const run = () => {
        props.toggleState({ ...props.state, pausing: !props.state.pausing });
        props.mecElement.run();
    }

    const toggleGravity = () => {
        props.toggleState({ ...props.state, gravity: !props.state.gravity });
        mecElement.toggleGravity();
    }

    return <List className={props.className}>
        <ListItem onClick={run}>
            {props.state.pausing ? <PlayArrowIcon /> : <PauseIcon />}
        </ListItem>
        <ListItem onClick={toggleGravity}>
            g {props.state.gravity ? <ClearIcon /> : <ArrowDownwardIcon />}
        </ListItem>
        <ListItem onClick={props.mec2.reset}>
            <RotateLeftIcon />
        </ListItem>
    </List>
}
import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ClearIcon from '@material-ui/icons/Clear';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';

export default function MecControl(props) {
    const [state, toggleState] = React.useState({
        gravity: false,
        pausing: true,
    });

    const run = () => {
        toggleState({ ...state, pausing: !state.pausing });
        props.mec2.run();
    }

    const toggleGravity = () => {
        toggleState({ ...state, gravity: !state.gravity });
        props.mec2.toggleGravity();
    }

    return <List className={props.className}>
        <ListItem>
            <IconButton onClick={run}>
                {state.pausing ? <PlayArrowIcon /> : <PauseIcon />}
            </IconButton>
        </ListItem>
        <ListItem>
            <IconButton onClick={toggleGravity}>
                g {state.gravity ? <ClearIcon /> : <ArrowDownwardIcon />}
            </IconButton>
        </ListItem>
        <ListItem>
            <IconButton onClick={props.mec2.reset}>
                <RotateLeftIcon />
            </IconButton>
        </ListItem>
    </List>
}
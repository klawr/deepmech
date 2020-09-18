import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ClearIcon from '@material-ui/icons/Clear';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';

import Button from './Button';

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
            <Button onClick={run} tooltip="Run/Pause mechanism">
                {state.pausing ? <PlayArrowIcon /> : <PauseIcon />}
            </Button>
        </ListItem>
        <ListItem>
            <Button onClick={toggleGravity} tooltip="Toggle gravity">
                g {state.gravity ? <ClearIcon /> : <ArrowDownwardIcon />}
            </Button>
        </ListItem>
        <ListItem>
            <Button onClick={props.mec2.reset} tooltip="Reset">
                <RotateLeftIcon />
            </Button>
        </ListItem>
    </List>
}
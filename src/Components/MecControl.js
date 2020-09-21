import React from 'react';
import { List } from '@material-ui/core';
import { ListButton } from '.';
import {
    ArrowDownward,
    Clear,
    Pause,
    PlayArrow,
    RotateLeft,
 } from '@material-ui/icons';


export default function MecControl({mec2, className}) {
    const [state, toggleState] = React.useState({
        gravity: false,
        pausing: true,
    });

    const run = () => {
        toggleState({ ...state, pausing: !state.pausing });
        mec2.run();
    }

    const toggleGravity = () => {
        toggleState({ ...state, gravity: !state.gravity });
        mec2.toggleGravity();
    }

    return <List className={className}>
        <ListButton onClick={run} tooltip="Run/Pause mechanism">
            {state.pausing ? <PlayArrow /> : <Pause />}
        </ListButton>
        <ListButton onClick={toggleGravity} tooltip="Toggle gravity">
            g {state.gravity ? <Clear /> : <ArrowDownward />}
        </ListButton>
        <ListButton onClick={mec2.reset} tooltip="Reset">
            <RotateLeft />
        </ListButton>
    </List>
}
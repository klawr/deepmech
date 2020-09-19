import React from 'react';

import {
    List
 } from '@material-ui/core';

import {
    ArrowDownward,
    Clear,
    Pause,
    PlayArrow,
    RotateLeft,
 } from '@material-ui/icons';

import ListButton from './ListButton';

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
        <ListButton onClick={run} tooltip="Run/Pause mechanism">
            {state.pausing ? <PlayArrow /> : <Pause />}
        </ListButton>
        <ListButton onClick={toggleGravity} tooltip="Toggle gravity">
            g {state.gravity ? <Clear /> : <ArrowDownward />}
        </ListButton>
        <ListButton onClick={props.mec2.reset} tooltip="Reset">
            <RotateLeft />
        </ListButton>
    </List>
}
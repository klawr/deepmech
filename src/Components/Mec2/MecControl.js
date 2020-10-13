import React from 'react';
import { List } from '@material-ui/core';
import { ListButton } from '..';
import {
    ArrowDownward,
    Clear,
    Pause,
    PlayArrow,
    RotateLeft,
} from '@material-ui/icons';
import { actionMec, selectMec } from '../../Features';
import { useDispatch, useSelector } from 'react-redux';

export default function MecControl({ mecReset, className }) {
    const dispatch = useDispatch();
    const mec = useSelector(selectMec);

    return <List className={className}>
        <ListButton onClick={() => dispatch(actionMec.toggleRun())} tooltip="Run/Pause mechanism">
            {mec.pausing ? <PlayArrow /> : <Pause />}
        </ListButton>
        <ListButton onClick={() => dispatch(actionMec.toggleGravity())} tooltip="Toggle gravity">
            g {mec.gravity ? <Clear /> : <ArrowDownward />}
        </ListButton>
        <ListButton onClick={mecReset} tooltip="Reset">
            <RotateLeft />
        </ListButton>
    </List>
}
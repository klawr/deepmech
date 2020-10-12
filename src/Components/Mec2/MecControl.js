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
import {
    toggleRun, toggleGravity,
    selectPausing, selectGravity
} from '../../Features';
import { useDispatch, useSelector } from 'react-redux';

export default function MecControl({ mecReset, className }) {
    const dispatch = useDispatch();
    const selectedPausing = useSelector(selectPausing);
    const selectedGravity = useSelector(selectGravity);

    return <List className={className}>
        <ListButton onClick={() => dispatch(toggleRun())} tooltip="Run/Pause mechanism">
            {selectedPausing ? <PlayArrow /> : <Pause />}
        </ListButton>
        <ListButton onClick={() => dispatch(toggleGravity())} tooltip="Toggle gravity">
            g {selectedGravity ? <Clear /> : <ArrowDownward />}
        </ListButton>
        <ListButton onClick={mecReset} tooltip="Reset">
            <RotateLeft />
        </ListButton>
    </List>
}
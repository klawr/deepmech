import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Divider, List, ListItem, Tooltip } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import { CameraAlt, Create, Delete, PanTool, RotateLeft } from '@material-ui/icons';
import { ListButton } from '..';
import {
    UIselect,
    UIactions,
    changeMode,
    selectMode,
    pause
} from '../../Features';
import DeepmechIcon from './DeepmechIcon';
import { togglePause } from '../../Features/MecModelSlice';

export default function DeepmechControl() {
    const dispatch = useDispatch();

    const selectedDeepmech = useSelector(UIselect).deepmech;
    const mode = useSelector(selectMode);

    function Toggle(elm, value, tooltip) {
        return <ToggleButton value={value}>
            <Tooltip title={tooltip}>
                {elm}
            </Tooltip>
        </ToggleButton>
    }

    function toggleDeepmech() {
        dispatch(UIactions.deepmech(!selectedDeepmech));
        if (selectedDeepmech) {
            dispatch(pause);
        }
    }

    return <List>
        {selectedDeepmech &&
            <div>
                <ListItem>
                    <ToggleButtonGroup
                        exclusive
                        orientation="vertical"
                        value={mode}
                        onChange={(e, val) => val && dispatch(changeMode(val))}>
                        {Toggle(<Create />, "draw", "Draw")}
                        {Toggle(<PanTool />, "drag", "Drag")}
                        {Toggle(<Delete />, "delete", "Delete")}
                        {Toggle(<CameraAlt />, "camera", "Camera")}
                    </ToggleButtonGroup>
                </ListItem>
                <Divider />
            </div>}
        <ListButton
            onClick={toggleDeepmech}
            tooltip={(selectedDeepmech ? "Exit" : "Activate") + " deepmech"}>
            {selectedDeepmech ? <RotateLeft /> : <DeepmechIcon />}
        </ListButton>
    </List>
}
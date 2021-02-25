import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Divider, List, ListItem, Tooltip } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import { CameraAlt, Create, Delete, Done, PanTool, RotateLeft } from '@material-ui/icons';
import { ListButton } from '..';
import { deepmechSelect, deepmechAction, mecAction } from '../../Features';
import DeepmechIcon from './DeepmechIcon';

export default function DeepmechControl() {
    const dispatch = useDispatch();

    const deepmech = useSelector(deepmechSelect);

    function Toggle(elm, value, tooltip, disabled) {
        return <ToggleButton value={value} disabled={disabled}>
            <Tooltip title={tooltip}>
                {elm}
            </Tooltip>
        </ToggleButton>
    }

    function toggleDeepmech() {
        dispatch(deepmechAction.active(!deepmech.active));
        if (deepmech.active) {
            dispatch(mecAction.pause);
        }
    }

    return <List>
        {deepmech.active &&
            <div>
                <ListItem>
                    <ToggleButtonGroup
                        exclusive
                        orientation="vertical"
                        value={deepmech.mode}
                        onChange={(e, val) => val && dispatch(deepmechAction.changeMode(val))}>
                        {Toggle(<Create />, "draw", "Draw")}
                        {Toggle(<PanTool />, "drag", "Drag")}
                        {Toggle(<Delete />, "delete", "Delete")}
                        {Toggle(<CameraAlt />, "camera", "Camera", true)}
                    </ToggleButtonGroup>
                </ListItem>
                <Divider />
                <ListButton
                    onClick={() => dispatch(deepmechAction.predict())}
                    tooltip="predict" >
                    <Done />
                </ListButton>
            </div>}
        <ListButton
            onClick={toggleDeepmech}
            tooltip={(deepmech.active ? "Exit" : "Activate") + " deepmech"}>
            {deepmech.active ? <RotateLeft /> : <DeepmechIcon />}
        </ListButton>
    </List>
}
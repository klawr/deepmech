import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Divider, List, ListItem, Tooltip } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import { CameraAlt, Create, Delete, Done, PanTool, RotateLeft } from '@material-ui/icons';
import { ListButton } from '..';
import {
    UiSelect,
    UiAction,
    deepmechAction,
    deepmechSelect,
    mecAction
} from '../../Features';
import DeepmechIcon from './DeepmechIcon';
import { deepmech } from '../../deepmech/index';

export default function DeepmechControl() {
    const dispatch = useDispatch();

    const UI = useSelector(UiSelect);
    const deepmech = useSelector(deepmechSelect);

    function Toggle(elm, value, tooltip) {
        return <ToggleButton value={value}>
            <Tooltip title={tooltip}>
                {elm}
            </Tooltip>
        </ToggleButton>
    }

    function toggleDeepmech() {
        dispatch(UiAction.deepmech(!UI.deepmech));
        if (UI.deepmech) {
            dispatch(mecAction.pause);
        }
    }

    function predict() {
        console.log('hi');
    }

    return <List>
        {UI.deepmech &&
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
                        {Toggle(<CameraAlt />, "camera", "Camera")}
                    </ToggleButtonGroup>
                </ListItem>
                <Divider />
                <ListButton onClick={predict} tooltip="predict" >
                    <Done />
                </ListButton>
            </div>}
        <ListButton
            onClick={toggleDeepmech}
            tooltip={(UI.deepmech ? "Exit" : "Activate") + " deepmech"}>
            {UI.deepmech ? <RotateLeft /> : <DeepmechIcon />}
        </ListButton>
    </List>
}
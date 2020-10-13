import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Divider, List, ListItem, Tooltip } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import { CameraAlt, Create, Delete, PanTool, RotateLeft } from '@material-ui/icons';
import { ListButton } from '..';
import {
    UiSelect,
    UiAction,
    changeMode,
    selectMode,
    mecAction
} from '../../Features';
import DeepmechIcon from './DeepmechIcon';

export default function DeepmechControl() {
    const dispatch = useDispatch();

    const UI = useSelector(UiSelect);
    const mode = useSelector(selectMode);

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

    return <List>
        {UI.deepmech &&
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
            tooltip={(UI.deepmech ? "Exit" : "Activate") + " deepmech"}>
            {UI.deepmech ? <RotateLeft /> : <DeepmechIcon />}
        </ListButton>
    </List>
}
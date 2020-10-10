import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Divider, List, ListItem, Tooltip } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import { CameraAlt, Create, Delete, PanTool, RotateLeft } from '@material-ui/icons';
import { ListButton } from '.';
import { UIselect, UIactions, changeMode, selectMode } from '../Features';

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
            onClick={() => dispatch(UIactions.deepmech(!selectedDeepmech))}
            tooltip={(selectedDeepmech ? "Exit" : "Activate") + " draw mode"}>
            {selectedDeepmech ? <RotateLeft /> : <Create />}
        </ListButton>
    </List>
}
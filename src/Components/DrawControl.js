import React from 'react';
import clsx from 'clsx';
import ReactDOM from 'react-dom';
import { Divider, List, ListItem, Tooltip } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import { CameraAlt, Create, Delete, RotateLeft } from '@material-ui/icons';
import { ListButton, DeepmechDraw } from '.';

export default function DrawControl({ mec2, classes, state, toggleState }) {
    const [mode, changeMode] = React.useState({
        draw: true,
        drag: false,
        camera: false,
        delete: false,
    });

    const deepmechDraw = document.getElementById('deepmech_draw')

    const toggleDrawMode = () => {
        toggleState({ ...state, drawing: !state.drawing });
        if (!state.drawing) {
            ReactDOM.render(<DeepmechDraw
                classes={classes} mec2={mec2} mode={mode} />, deepmechDraw);
        } else {
            ReactDOM.unmountComponentAtNode(deepmechDraw);
        }
    };

    const onChange = (event, newValue) => {
        if (newValue) {
            mode[newValue] = true;
            mode[getTrueKey()] = false;
            changeMode({ ...mode, [getTrueKey()]: false, [newValue]: true });
        }
    }

    function Toggle(elm, value, tooltip) {
        return <ToggleButton value={value}>
            <Tooltip title={tooltip}>
                {elm}
            </Tooltip>
        </ToggleButton>
    }

    function getTrueKey() {
        return Object.keys(mode).filter(k => mode[k])[0];
    }

    return <List>
        <div className={clsx({ [classes.hide]: !state.drawing })}>
            <ListItem>
                <ToggleButtonGroup
                    exclusive
                    orientation="vertical"
                    value={getTrueKey()}
                    onChange={onChange}>
                    {Toggle(<Create />, "draw", "Draw")}
                    {Toggle(<CameraAlt />, "camera", "Camera")}
                    {Toggle(<Delete />, "delete", "Delete")}
                </ToggleButtonGroup>
            </ListItem>
            <Divider />
        </div>
        <ListButton
            onClick={toggleDrawMode}
            tooltip={(state.drawing ? "Exit" : "Activate") + " draw mode"}>
            {state.drawing ? <RotateLeft /> : <Create />}
        </ListButton>
    </List>
}
import React from 'react';
import clsx from 'clsx';
import ReactDOM from 'react-dom';
import { Divider, List, ListItem, Tooltip } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import { CameraAlt, Create, Delete, RotateLeft } from '@material-ui/icons';
import { ListButton, DeepmechCanvas } from '.';

export default function DeepmechControl({ mec2, classes, state, toggleState }) {
    const [mode, changeMode] = React.useState({
        draw: true,
        drag: false,
        camera: false,
        delete: false,
    });

    const deepmechCanvas = document.getElementById('deepmech_canvas')

    const toggleDrawMode = () => {
        toggleState({ ...state, drawing: !state.drawing });
        if (!state.drawing) {
            ReactDOM.render(<DeepmechCanvas
                classes={classes} mec2={mec2} mode={mode} />, deepmechCanvas);
        } else {
            ReactDOM.unmountComponentAtNode(deepmechCanvas);
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
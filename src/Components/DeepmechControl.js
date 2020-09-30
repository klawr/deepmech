import React from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Divider, List, ListItem, Tooltip } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import { CameraAlt, Create, Delete, RotateLeft } from '@material-ui/icons';
import { ListButton, DeepmechCanvas } from '.';
import { select, actions } from '../Features/UISlice';

export default function DeepmechControl({ mec2, classes }) {
    const [mode, changeMode] = React.useState({
        draw: true,
        drag: false,
        camera: false,
        delete: false,
    });

    const dispatch = useDispatch();

    const selectedDeepmech = useSelector(select).deepmech;
    const deepmechCanvas = document.getElementById('deepmech_canvas')

    const toggleDrawMode = () => {
        dispatch(actions.deepmech(!selectedDeepmech));
        if (!selectedDeepmech) {
            renderDeepmechCanvas();
        } else {
            ReactDOM.unmountComponentAtNode(deepmechCanvas);
        }
    };

    function renderDeepmechCanvas() {
        ReactDOM.render(<DeepmechCanvas
            classes={classes} mec2={mec2} mode={mode} />, deepmechCanvas);
    }

    const onChange = (event, newValue) => {
        if (newValue) {
            // TODO this is bad...find something else
            mode[getTrueKey()] = false;
            mode[newValue] = true;
            changeMode({ ...mode })
            renderDeepmechCanvas();
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
        {selectedDeepmech &&
            <div>
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
            </div>}
        <ListButton
            onClick={toggleDrawMode}
            tooltip={(selectedDeepmech ? "Exit" : "Activate") + " draw mode"}>
            {selectedDeepmech ? <RotateLeft /> : <Create />}
        </ListButton>
    </List>
}
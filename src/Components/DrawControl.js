import React from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
import { List } from '@material-ui/core';
import { Create, RotateLeft } from '@material-ui/icons';
import { ListButton, DeepmechDraw } from '.';

export default function DrawControl({ mec2, classes, state, toggleState }) {
    const deepmechDraw = document.getElementById('deepmech_draw')

    const toggleDrawMode = () => {
        toggleState({ ...state, drawing: !state.drawing });
        if (!state.drawing) {
            activateDrawMode();
        } else {
            deactivateDrawMode();
        }
    };

    function activateDrawMode() {
        ReactDOM.render(<DeepmechDraw
            classes={classes} mec2={mec2} state={state} />, deepmechDraw);
    }

    function deactivateDrawMode() {
        ReactDOM.unmountComponentAtNode(deepmechDraw);
    }

    return <List>
        <ListButton
            onClick={toggleDrawMode}
            tooltip={(state.drawing ? "Exit" : "Activate") + " draw mode"}>
            {state.drawing ? <RotateLeft /> : <Create />}
        </ListButton>
    </List>
}
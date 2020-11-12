import React from 'react';
import { Menu } from '@material-ui/core'

export default function ContextMenu({ children }) {
    const initialState = { mouseX: null, mouseY: null };

    const [state, setState] = React.useState(initialState);

    function handleClick(e) {
        e.preventDefault();
        setState({
            mouseX: e.clientX - 2,
            mouseY: e.clientY - 4,
        });
    };
    function handleClose() {
        setState(initialState);
    };

    return <div onContextMenu={handleClick} style={{ cursor: 'context-menu' }}>
        {children[0]}
        <Menu
            onClick={handleClose}
            keepMounted
            open={state.mouseY !== null}
            onClose={handleClose}
            anchorReference="anchorPosition"
            anchorPosition={
                state.mouseY !== null && state.mouseX !== null
                    ? { top: state.mouseY, left: state.mouseX }
                    : undefined
            } >
            {children.slice(1)}
        </Menu>
    </div>
}
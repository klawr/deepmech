import React from 'react';

import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';


import { useStyle } from './style';
import { LeftDrawer } from './LeftDrawer';
import { RightDrawer } from './RightDrawer';

export function DeepmechUI(props) {
    const [state, toggleState] = React.useState({
        left: false,
        right: false,
        gravity: false,
        pausing: true,
        drawing: false,
    });

    const toggleDrawer = (side, change) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        toggleState({ ...state, [side]: change });
    };

    const classes = useStyle();

    return (
        <div className={classes.root}>
            <canvas className={clsx(classes.drawCanvas, !state.drawing && classes.hide)} />
            <LeftDrawer
                mec2={props.mec2}
                state={state}
                toggleState={toggleState}/>
            <RightDrawer
                mec2={props.mec2}
                state={state}
                toggleState={toggleState}/>
            <Grid className={classes.buttonGrid} container direction="row">
                <IconButton
                    onClick={toggleDrawer("left", true)}
                    className={clsx(classes.menuButton, state.left && classes.hide)} >
                    <ChevronRightIcon />
                </IconButton>
                <h3>&nbsp; 🚧 Work in progress 🚧 </h3>
                <IconButton
                    onClick={toggleDrawer("right", true)}
                    className={clsx(classes.right, classes.menuButton, state.right && classes.hide)} >
                    <ChevronLeftIcon />
                </IconButton>
            </Grid>
        </div >
    );
}

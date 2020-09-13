import React from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';

import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';


import { useStyle } from './style';
import { LeftDrawer } from './LeftDrawer';
import { RightDrawer } from './RightDrawer';

function DeepmechNav() {
    const [state, toggleState] = React.useState({
        left: false,
        right: false,
        gravity: false,
        pausing: true,
        drawing: false,
    });

    const toggleLeftDrawer = (change) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        toggleState({ ...state, left: change });
    };

    const toggleRightDrawer = (change) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        toggleState({ ...state, right: change });
    }

    const ref = mecElement;

    const classes = useStyle();

    return (
        <div className={classes.root}>
            <canvas className={clsx(classes.drawCanvas, !state.drawing && classes.hide)} />
            <LeftDrawer
                mec2={ref}
                state={state}
                toggleState={toggleState}/>
            <RightDrawer
                mec2={ref}
                state={state}
                toggleState={toggleState}/>
            <Grid className={classes.buttonGrid} container direction="row">
                <IconButton
                    onClick={toggleLeftDrawer(true)}
                    className={clsx(classes.menuButton, state.left && classes.hide)} >
                    <ChevronRightIcon />
                </IconButton>
                <h3>&nbsp; 🚧 Work in progress 🚧 </h3>
                <IconButton
                    onClick={toggleRightDrawer(true)}
                    className={clsx(classes.right, classes.menuButton, state.right && classes.hide)} >
                    <ChevronLeftIcon />
                </IconButton>
            </Grid>
        </div >
    );
}

ReactDOM.render(<DeepmechNav />, document.getElementById('deepmech_nav'))

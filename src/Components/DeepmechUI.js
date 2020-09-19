import React from 'react';

import Grid from '@material-ui/core/Grid';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import useStyle from '../style';
import LeftDrawer from './LeftDrawer';
import RightDrawer from './RightDrawer';
import DeepmechDraw from './DeepmechDraw';
import ListButton from './ListButton';

export default function DeepmechUI(props) {
    const [state, toggleState] = React.useState({
        left: false,
        right: false,
        drawing: false,
    });

    const openDrawer = (side) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        toggleState({ ...state, [side]: true });
    };

    const classes = useStyle();

    return (
        <div className={classes.root}>
            <DeepmechDraw
                classes={classes}
                state={state} />
            <LeftDrawer
                classes={classes}
                mec2={props.mec2}
                state={state}
                toggleState={toggleState} />
            <RightDrawer
                classes={classes}
                mec2={props.mec2}
                state={state}
                toggleState={toggleState} />
            <Grid container direction="row"
                className={classes.buttonGrid}>
                <ListButton
                    onClick={openDrawer('left')}
                    tooltip="Open left drawer">
                    <ChevronRightIcon />
                </ListButton>
                <h3>&nbsp; 🚧 WIP 🚧 </h3>
                <ListButton
                    onClick={openDrawer("right")}
                    tooltip="Open right drawer"
                    className={classes.right} >
                    <ChevronLeftIcon />
                </ListButton>
            </Grid>
        </div>
    );
}

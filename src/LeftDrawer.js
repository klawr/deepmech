import React from 'react';

import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ClearIcon from '@material-ui/icons/Clear';
import CreateIcon from '@material-ui/icons/Create';
import GitHubIcon from '@material-ui/icons/GitHub';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';

export function LeftDrawer(props) {
    const run = () => {
        props.toggleState({ ...props.state, pausing: !props.state.pausing });
        props.mecElement.run();
    }

    const closeDrawer = () => (event) => {
        props.toggleState({ ...props.state, left: false });
    };
    
    const toggleGravity = () => {
        props.toggleState({ ...props.state, gravity: !props.state.gravity });
        mecElement.toggleGravity();
    }

    const toggleDrawMode = () => {
        props.toggleState({ ...props.state, drawing: !props.state.drawing });
    }

    return <Drawer
        className={props.classes.leftDrawer}
        open={props.state.left}
        anchor="left"
        variant="persistent">
        <List className={clsx(props.state.drawing && props.classes.hide)}>
            <ListItem onClick={closeDrawer()}>
                <ChevronLeftIcon />
            </ListItem>
            <ListItem onClick={run}>
                {props.state.pausing ? <PlayArrowIcon /> : <PauseIcon />}
            </ListItem>
            <ListItem onClick={toggleGravity}>
                g {props.state.gravity ? <ClearIcon /> : <ArrowDownwardIcon />}
            </ListItem>
            <ListItem onClick={props.mec2.reset}>
                <RotateLeftIcon />
            </ListItem>
            <ListItem onClick={toggleDrawMode}>
                <CreateIcon />
            </ListItem>
        </List>
        <List className={props.classes.listBottom}>
            <ListItem>
                <a href="https://github.com/klawr/deepmech" target="_blank">
                    <GitHubIcon />
                </a>
            </ListItem>
        </List>
        <List className={clsx(!props.state.drawing && props.classes.hide)}>
            <ListItem onClick={closeDrawer()}>
                <ChevronLeftIcon />
            </ListItem>
            <ListItem onClick={toggleDrawMode}>
                <RotateLeftIcon />
            </ListItem>
        </List>
    </Drawer>
}

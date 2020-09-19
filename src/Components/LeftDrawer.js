import React from 'react';
import clsx from 'clsx';

import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';

import Brightness4Icon from '@material-ui/icons/Brightness4';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import GitHubIcon from '@material-ui/icons/GitHub';

import MecControl from './MecControl';
import DrawControl from './DrawControl';
import ListButton from './ListButton';

export default function LeftDrawer(props) {
    const closeDrawer = () => () => {
        props.toggleState({ ...props.state, left: false });
    };

    return <Drawer
        open={props.state.left}
        anchor="left"
        variant="persistent">
        <List>
            <ListButton onClick={closeDrawer()} tooltip="Close drawer">
                <ChevronLeftIcon />
            </ListButton>
        </List>
        <Divider />
        <MecControl mec2={props.mec2}
            className={clsx({ [props.classes.hide]: props.state.drawing })} />
        <Divider />
        <DrawControl
            state={props.state}
            toggleState={props.toggleState}
            classes={props.classes}
            state={props.state}
        />
        <Divider />
        <List className={props.classes.listBottom}>
            <ListButton
                onClick={() => props.toggleDarkMode(!props.state.dark)}
                tooltip="Toggle dark mode">
                <Brightness4Icon/>
            </ListButton>
            <ListButton tooltip="Project page">
                <a href="https://github.com/klawr/deepmech" target="_blank">
                    <GitHubIcon />
                </a>
            </ListButton>
        </List>
    </Drawer>
}

import React from 'react';
import clsx from 'clsx';

import {
    Divider,
    Drawer,
    List,
} from '@material-ui/core';

import {
    Brightness4 as Brightness4Icon,
    ChevronLeft as ChevronLeftIcon,
    GitHub as GitHubIcon,
} from '@material-ui/icons';

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
                onClick={() => props.toggleState({ ...props.state, ['dark']: !props.state.dark })}
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

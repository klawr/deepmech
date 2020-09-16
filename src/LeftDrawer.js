import React from 'react';

import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import GitHubIcon from '@material-ui/icons/GitHub';

import { MecControl } from './MecControl';
import { DrawControl } from './DrawControl';

export function LeftDrawer(props) {

    const closeDrawer = () => (event) => {
        props.toggleState({ ...props.state, left: false });
    };

    return <Drawer
        className={props.classes.leftDrawer}
        open={props.state.left}
        anchor="left"
        variant="persistent">
        <List>
            <ListItem onClick={closeDrawer()}>
                <ChevronLeftIcon />
            </ListItem>
        </List>
        <MecControl mec2={props.mec2}
            state={props.state}
            className={clsx({ [props.classes.hide]: props.state.drawing })} />
        <DrawControl
            state={props.state}
            toggleState={props.toggleState}
            classes={props.classes}
            state={props.state}
        />
        <List className={props.classes.listBottom}>
            <ListItem>
                <a href="https://github.com/klawr/deepmech" target="_blank">
                    <GitHubIcon />
                </a>
            </ListItem>
        </List>
    </Drawer>
}

import React from 'react';

import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import CreateIcon from '@material-ui/icons/Create';
import GitHubIcon from '@material-ui/icons/GitHub';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';

import { MecControl } from './MecControl';

export function LeftDrawer(props) {

    const closeDrawer = () => (event) => {
        props.toggleState({ ...props.state, left: false });
    };

    const toggleDrawMode = () => {
        props.toggleState({ ...props.state, drawing: !props.state.drawing });
    }

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
            className={clsx({[props.classes.hide]: props.state.drawing})}/>
        <List>
            <ListItem onClick={toggleDrawMode}>
                <CreateIcon className={clsx({[props.classes.hide]: props.state.drawing})}/>
                <RotateLeftIcon className={clsx({[props.classes.hide]: !props.state.drawing})}/>
            </ListItem>
        </List>
        <List className={props.classes.listBottom}>
            <ListItem>
                <a href="https://github.com/klawr/deepmech" target="_blank">
                    <GitHubIcon />
                </a>
            </ListItem>
        </List>
    </Drawer>
}

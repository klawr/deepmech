import React from 'react';
import clsx from 'clsx';
import { Divider, Drawer, List } from '@material-ui/core';
import { Brightness4, ChevronLeft, GitHub } from '@material-ui/icons';
import { MecControl, DeepmechControl, ListButton } from '.';

export default function LeftDrawer({ state, toggleState, classes, mec2 }) {
    const closeDrawer = () => {
        toggleState({ ...state, left: false });
    };

    return <Drawer
        open={state.left}
        anchor="left"
        variant="persistent">
        <List>
            <ListButton onClick={closeDrawer} tooltip="Close drawer">
                <ChevronLeft />
            </ListButton>
        </List>
        <Divider />
        <MecControl mec2={mec2}
            className={clsx({ [classes.hide]: state.drawing })} />
        <Divider />
        <DeepmechControl mec2={mec2} state={state} toggleState={toggleState} classes={classes} />
        <Divider />
        <List className={classes.listBottom}>
            <ListButton
                onClick={() => toggleState({ ...state, ['dark']: !state.dark })}
                tooltip="Toggle dark mode">
                <Brightness4 />
            </ListButton>
            <ListButton tooltip="Project page">
                <a href="https://github.com/klawr/deepmech" target="_blank">
                    <GitHub />
                </a>
            </ListButton>
        </List>
    </Drawer>
}

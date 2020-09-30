import React from 'react';
import clsx from 'clsx';
import { Divider, Drawer, List } from '@material-ui/core';
import { Brightness4, ChevronLeft, GitHub } from '@material-ui/icons';
import { MecControl, DeepmechControl, ListButton } from '.';
import { useSelector, useDispatch } from 'react-redux';
import { darkmode, selectDarkmode, left, selectLeft, selectDeepmech } from '../Features/UISlice';

export default function LeftDrawer({ classes, mec2 }) {
    const dispatch = useDispatch();
    const open = useSelector(selectLeft);
    const selectedDarkmode = useSelector(selectDarkmode);
    const selectedDeepmech = useSelector(selectDeepmech);

    return <Drawer
        open={open}
        anchor="left"
        variant="persistent">
        <List>
            <ListButton
                onClick={() => dispatch(left(false))}
                tooltip="Close drawer">
                <ChevronLeft />
            </ListButton>
        </List>
        <Divider />
        {selectedDeepmech ? <div /> :
            <div>
                <MecControl mec2={mec2} />
                <Divider />
            </div>}
        <DeepmechControl mec2={mec2} classes={classes} />
        <Divider />
        <List className={classes.listBottom}>
            <ListButton
                onClick={() => dispatch(darkmode(!selectedDarkmode))}
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

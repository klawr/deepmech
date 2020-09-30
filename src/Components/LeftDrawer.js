import React from 'react';
import { Divider, Drawer, List } from '@material-ui/core';
import { Brightness4, ChevronLeft, GitHub } from '@material-ui/icons';
import { MecControl, DeepmechControl, ListButton } from '.';
import { useSelector, useDispatch } from 'react-redux';
import { actions, select } from '../Features/UISlice';

export default function LeftDrawer({ classes, mec2 }) {
    const dispatch = useDispatch();
    const open = useSelector(select).left;
    const selectedDarkmode = useSelector(select).darkmode;
    const selectedDeepmech = useSelector(select).deepmech;

    return <Drawer
        open={open}
        anchor="left"
        variant="persistent">
        <List>
            <ListButton
                onClick={() => dispatch(actions.left(false))}
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
                onClick={() => dispatch(actions.darkmode(!selectedDarkmode))}
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

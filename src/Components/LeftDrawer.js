import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Divider, Drawer, List } from '@material-ui/core';
import { Brightness4, ChevronLeft, GitHub } from '@material-ui/icons';
import { MecControl, DeepmechControl, ListButton } from '.';
import { UIactions, UIselect, mecAction } from '../Features';

export default function LeftDrawer({ classes, mecReset }) {
    const dispatch = useDispatch();
    const open = useSelector(UIselect).left;
    const selectedDarkmode = useSelector(UIselect).darkmode;
    const selectedDeepmech = useSelector(UIselect).deepmech;

    return <Drawer
        open={open}
        anchor="left"
        variant="persistent">
        <List>
            <ListButton
                onClick={() => dispatch(UIactions.left(false))}
                tooltip="Close drawer">
                <ChevronLeft />
            </ListButton>
        </List>
        <Divider />
        {selectedDeepmech ? <div /> :
            <div>
                <MecControl mecReset={mecReset} />
                <Divider />
            </div>}
        <DeepmechControl classes={classes} />
        <Divider />
        <List className={classes.listBottom}>
            <ListButton
                onClick={() => {
                    dispatch(mecAction.toggleDarkmode(!selectedDarkmode));
                    dispatch(UIactions.darkmode(!selectedDarkmode));
                }}
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

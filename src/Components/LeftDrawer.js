import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Divider, Drawer, List } from '@material-ui/core';
import { Brightness4, ChevronLeft, GitHub, Storage } from '@material-ui/icons';
import { MecControl, DeepmechControl, ListButton } from '.';
import { UiAction, UiSelect, mecAction, deepmechSelect, deepmechAction } from '../Features';

export default function LeftDrawer({ classes, mecReset }) {
    const dispatch = useDispatch();
    const UI = useSelector(UiSelect);
    const deepmech = useSelector(deepmechSelect)

    return <Drawer
        open={UI.left}
        anchor="left"
        variant="persistent">
        <List>
            <ListButton
                onClick={() => dispatch(UiAction.left(false))}
                tooltip="Close drawer">
                <ChevronLeft />
            </ListButton>
        </List>
        <Divider />
        {deepmech.active ? <div /> :
            <div>
                <MecControl mecReset={mecReset} />
                <Divider />
            </div>}
        <DeepmechControl classes={classes} />
        <Divider />
        <List className={classes.listBottom}>
            <ListButton
                onClick={() => {
                    dispatch(deepmechAction.register({prediction: true, serverport: 8337}))
                }}
                tooltip="Activate server prediction">
                <Storage/>
            </ListButton>
            <ListButton
                onClick={() => {
                    dispatch(mecAction.darkmode(!UI.darkmode));
                    dispatch(UiAction.darkmode(!UI.darkmode));
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

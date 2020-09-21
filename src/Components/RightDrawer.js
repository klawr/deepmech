import React from 'react';
import { Grid, List, SwipeableDrawer } from '@material-ui/core';
import { ChevronRight, Lock, LockOpen } from '@material-ui/icons';
import { ListButton, MecProperties } from '.';

export default function RightDrawer({ state, toggleState, classes, mec2 }) {
    const [locked, toggleLock] = React.useState(false);

    const toggleRightDrawer = (change) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        toggleState({ ...state, right: change });
    }

    window.addEventListener('resize', () => {
        toggleState({ ...state, right: false });
    });

    return <SwipeableDrawer
        open={state.right}
        onClose={toggleRightDrawer(false)}
        onOpen={toggleRightDrawer(true)}
        variant={locked ? 'persistent' : 'temporary'}
        anchor="right">
        <List>
            <Grid container direction="row">
                <ListButton onClick={toggleRightDrawer(false)} tooltip="Close drawer">
                    <ChevronRight />
                </ListButton>
                <ListButton
                    tooltip={(locked ? "Unlock" : "Lock") + " drawer"}
                    className={classes.right}
                    onClick={() => toggleLock(!locked)}>
                    {locked ? <Lock /> : <LockOpen />}
                </ListButton>
            </Grid>
            {Object.entries(JSON.parse(mec2._model.asJSON())).map(list => (
                <MecProperties
                    key={list[0]}
                    mec2={mec2}
                    classes={classes}
                    prop={list[0]}
                    value={list[1]} />
            ))}
        </List>
    </SwipeableDrawer>
}

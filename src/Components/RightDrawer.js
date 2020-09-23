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

    window.addEventListener('orientationchange', () => {
        toggleState({ ...state, right: false });
    });

    const [model, updateModel] = React.useState(JSON.parse(mec2._model.asJSON()));

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
            <MecProperties
                mec2={mec2}
                model={model}
                updateModel={updateModel}
                classes={classes} />
        </List>
    </SwipeableDrawer>
}

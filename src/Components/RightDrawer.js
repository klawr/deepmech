import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, List, SwipeableDrawer } from '@material-ui/core';
import { ChevronRight, Lock, LockOpen } from '@material-ui/icons';
import { ListButton, MecProperties } from '.';
import { UiAction, UiSelect } from '../Features';

export default function RightDrawer({ classes }) {
    const dispatch = useDispatch();
    const right = useSelector(UiSelect).right;

    const [locked, toggleLock] = React.useState(globalThis.innerWidth > 1200);

    window.addEventListener('orientationchange', () => dispatch(UiAction.right(false)));

    return <SwipeableDrawer
        open={right}
        onClose={() => dispatch(UiAction.right(false))}
        onOpen={() => dispatch(UiAction.right(true))}
        variant={locked ? 'persistent' : 'temporary'}
        anchor="right">
        <List>
            <Grid container direction="row">
                <ListButton
                    onClick={() => dispatch(UiAction.right(false))}
                    tooltip="Close drawer">
                    <ChevronRight />
                </ListButton>
                <ListButton
                    tooltip={(locked ? "Unlock" : "Lock") + " drawer"}
                    className={classes.right}
                    onClick={() => toggleLock(!locked)}>
                    {locked ? <Lock /> : <LockOpen />}
                </ListButton>
            </Grid>
            <MecProperties classes={classes} />
        </List>
    </SwipeableDrawer>
}

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, List, SwipeableDrawer } from '@material-ui/core';
import { ChevronRight, Lock, LockOpen } from '@material-ui/icons';
import { ListButton, MecProperties } from '.';
import { UIactions, UIselect } from '../Features';

export default function RightDrawer({ classes, mec2 }) {
    const dispatch = useDispatch();
    const open = useSelector(UIselect).right;

    const [locked, toggleLock] = React.useState(globalThis.innerWidth > 1200);
    // const [model, updateModel] = React.useState(JSON.parse(mec2._model.asJSON()));

    window.addEventListener('orientationchange', () => dispatch(UIactions.right(false)));

    return <SwipeableDrawer
        open={open}
        onClose={() => dispatch(UIactions.right(false))}
        onOpen={() => dispatch(UIactions.right(true))}
        variant={locked ? 'persistent' : 'temporary'}
        anchor="right">
        <List>
            <Grid container direction="row">
                <ListButton
                    onClick={() => dispatch(UIactions.right(false))}
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
            <MecProperties mec2={mec2} classes={classes} />
        </List>
    </SwipeableDrawer>
}

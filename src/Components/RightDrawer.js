import React from 'react';
import { Grid, List, SwipeableDrawer } from '@material-ui/core';
import { ChevronRight, Lock, LockOpen } from '@material-ui/icons';
import { ListButton, MecProperties } from '.';
import { useSelector, useDispatch } from 'react-redux';
import { actions, select } from '../Features/UISlice';

export default function RightDrawer({ classes, mec2 }) {
    const dispatch = useDispatch();
    const open = useSelector(select).right;

    const [locked, toggleLock] = React.useState(false);
    const [model, updateModel] = React.useState(JSON.parse(mec2._model.asJSON()));

    window.addEventListener('orientationchange', () => dispatch(actions.right(false)));

    return <SwipeableDrawer
        open={open}
        onClose={() => dispatch(actions.right(false))}
        onOpen={() => dispatch(actions.right(true))}
        variant={locked ? 'persistent' : 'temporary'}
        anchor="right">
        <List>
            <Grid container direction="row">
                <ListButton
                    onClick={() => dispatch(actions.right(false))}
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
            <MecProperties
                mec2={mec2}
                model={model}
                updateModel={updateModel}
                classes={classes} />
        </List>
    </SwipeableDrawer>
}

import React from 'react';
import { Grid, List, SwipeableDrawer } from '@material-ui/core';
import { ChevronRight, Lock, LockOpen } from '@material-ui/icons';
import { ListButton, MecProperties } from '.';

export default function RightDrawer(props) {
    const [locked, toggleLock] = React.useState(false);

    const toggleRightDrawer = (change) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        props.toggleState({ ...props.state, right: change });
    }

    window.addEventListener('resize', () => {
        props.toggleState({ ...props.state, right: false });
    });

    return <SwipeableDrawer
        open={props.state.right}
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
                    className={props.classes.right}
                    onClick={() => toggleLock(!locked)}>
                    {locked ? <Lock /> : <LockOpen />}
                </ListButton>
            </Grid>
            {Object.entries(JSON.parse(props.mec2._model.asJSON())).map(list => (
                <MecProperties classes={props.classes} key={list[0]} list={list}/>
            ))}
        </List>
    </SwipeableDrawer>
}

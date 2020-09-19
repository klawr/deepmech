import React from 'react';

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    List,
    ListItem,
    SwipeableDrawer,
} from '@material-ui/core';

import {
    ChevronRight as ChevronRightIcon,
    Lock as LockIcon,
    LockOpen as LockOpenIcon
} from '@material-ui/icons';

import ListButton from './ListButton';
import MecTable from './MecTable';

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
            <ListItem style={{ padding: 0 }}>
                <ListButton onClick={toggleRightDrawer(false)} tooltip="Close drawer">
                    <ChevronRightIcon />
                </ListButton>
                <ListButton
                    tooltip={(locked ? "Unlock" : "Lock") + " drawer"}
                    className={props.classes.right}
                    onClick={() => toggleLock(!locked)}>
                    {locked ? <LockIcon /> : <LockOpenIcon />}
                </ListButton>
            </ListItem>
            {Object.entries(JSON.parse(props.mec2._model.asJSON())).map(list => (
                <Accordion key={list[0]}>
                    <AccordionSummary>
                        {list[0]}
                    </AccordionSummary>
                    <AccordionDetails>
                        <MecTable list={list[1]} />
                    </AccordionDetails>
                </Accordion>
            ))}
        </List>
    </SwipeableDrawer>
}

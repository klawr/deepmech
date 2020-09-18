import React from 'react';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';

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
            <ListItem style={{padding: 0}}>
                <ListButton onClick={toggleRightDrawer(false)} tooltip="Close drawer">
                    <ChevronRightIcon />
                </ListButton>
                <ListButton
                    tooltip={(locked ? "Unlock" : "Lock") + " drawer"}
                    className={props.classes.right}
                    onClick={() => toggleLock(!locked)}>
                    {locked ? <LockOpenIcon /> : <LockIcon />}
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

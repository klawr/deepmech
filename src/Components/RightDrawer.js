import React from 'react';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { MecTable } from './MecTable';

export function RightDrawer(props) {
    const toggleRightDrawer = (change) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        props.toggleState({ ...props.state, right: change });
    }

    return <SwipeableDrawer
        open={props.state.right}
        className={props.classes.rightDrawer}
        onClose={toggleRightDrawer(false)}
        onOpen={toggleRightDrawer(true)}
        anchor="right">
        <List>
            <ListItem onClick={toggleRightDrawer(false)}>
                <ChevronRightIcon />
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

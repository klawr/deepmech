import React from 'react';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { useStyle } from './style';

function createTable(list) {
    function createHeader(arr) {
        const header = [];
        for (const obj of arr) {
            for (const key of Object.keys(obj)) {
                if (!header.includes(key)) {
                    header.push(key);
                }
            }
        }
        return header;
    }
    
    function sanitizeValue(val) {
        if (typeof val === "object") {
            return JSON.stringify(val);
        }
        else {
            return val.toString();
        }
    }

    return <TableContainer>
        <Table>
            <TableHead>
                <TableRow>
                    {createHeader(list).map(key => (
                        <TableCell key={key}>
                            <b>{key}</b>
                        </TableCell>))}
                </TableRow>
            </TableHead>
            <TableBody>
                {list.map && list.map((elm, idx) => (
                    <TableRow key={idx}>
                        {Object.entries(elm).map(val => (
                            <TableCell key={val[0]}>
                                {sanitizeValue(val[1])}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
}

export function RightDrawer(props) {
    const toggleRightDrawer = (change) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        props.toggleState({ ...props.state, right: change });
    }

    const classes = useStyle();

    return <SwipeableDrawer
        open={props.state.right}
        className={classes.rightDrawer}
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
                        {createTable(list[1])}
                    </AccordionDetails>
                </Accordion>
            ))}
        </List>
    </SwipeableDrawer>
}

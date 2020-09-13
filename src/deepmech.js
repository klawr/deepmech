import React from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ClearIcon from '@material-ui/icons/Clear';
import CreateIcon from '@material-ui/icons/Create';
import GitHubIcon from '@material-ui/icons/GitHub';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { useStyle } from './style';

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

function createTable(list) {
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

function DeepmechNav() {
    const [state, toggleState] = React.useState({
        left: false,
        right: false,
        gravity: false,
        pausing: true,
        drawing: false,
    });

    const toggleLeftDrawer = (change) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        toggleState({ ...state, left: change });
    };

    const toggleRightDrawer = (change) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        toggleState({ ...state, right: change });
    }

    const ref = mecElement;

    const run = () => {
        toggleState({ ...state, pausing: !state.pausing });
        mecElement.run();
    }

    const toggleGravity = () => {
        toggleState({ ...state, gravity: !state.gravity });
        mecElement.toggleGravity();
    }

    const toggleDrawMode = () => {
        setDrawMode({ ...state, drawing: !state.drawing });
    }

    const classes = useStyle();

    return (
        <div className={classes.root}>
            <canvas className={clsx(classes.drawCanvas, !state.drawing && classes.hide)} />
            <Drawer
                className={classes.leftDrawer}
                open={state.left}
                anchor="left"
                variant="persistent">
                <List className={clsx(state.drawing && classes.hide)}>
                    <ListItem onClick={toggleLeftDrawer(false)}>
                        <ChevronLeftIcon />
                    </ListItem>
                    <ListItem onClick={run}>
                        {state.pausing ? <PlayArrowIcon /> : <PauseIcon />}
                    </ListItem>
                    <ListItem onClick={toggleGravity}>
                        g {state.gravity ? <ClearIcon /> : <ArrowDownwardIcon />}
                    </ListItem>
                    <ListItem onClick={ref.reset}>
                        <RotateLeftIcon />
                    </ListItem>
                    <ListItem onClick={toggleDrawMode}>
                        <CreateIcon />
                    </ListItem>
                </List>
                <List className={classes.listBottom}>
                    <ListItem>
                        <a href="https://github.com/klawr/deepmech">
                            <GitHubIcon />
                        </a>
                    </ListItem>
                </List>
                <List className={clsx(!state.drawing && classes.hide)}>
                    <ListItem onClick={toggleLeftDrawer(false)}>
                        <ChevronLeftIcon />
                    </ListItem>
                    <ListItem onClick={toggleDrawMode}>
                        <RotateLeftIcon />
                    </ListItem>
                </List>
            </Drawer>
            <SwipeableDrawer
                open={state.right}
                className={classes.rightDrawer}
                onClose={toggleRightDrawer(false)}
                onOpen={toggleRightDrawer(true)}
                anchor="right">
                <List>
                    <ListItem onClick={toggleRightDrawer(false)}>
                        <ChevronRightIcon />
                    </ListItem>
                    {Object.entries(JSON.parse(mecElement._model.asJSON())).map(list => (
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
            <Grid className={classes.buttonGrid} container direction="row">
                <IconButton
                    onClick={toggleLeftDrawer(true)}
                    className={clsx(classes.menuButton, state.left && classes.hide)} >
                    <ChevronRightIcon />
                </IconButton>
                <h3>&nbsp; 🚧 Work in progress 🚧 </h3>
                <IconButton
                    onClick={toggleRightDrawer(true)}
                    className={clsx(classes.right, classes.menuButton, state.right && classes.hide)} >
                    <ChevronLeftIcon />
                </IconButton>
            </Grid>
        </div >
    );
}

ReactDOM.render(<DeepmechNav />, document.getElementById('deepmech_nav'))

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
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles, useTheme } from '@material-ui/core/styles';

const leftDrawerWidth = 100;
const rightDrawerWidth = "auto";

const useStyle = makeStyles((theme) => ({
    root: {
        display: 'flex'
    },
    leftDrawer: {
        width: leftDrawerWidth,
        flexShrink: 0,
    },
    leftDrawerPaper: {
        width: leftDrawerWidth,
    },
    rightDrawer: {
        width: rightDrawerWidth,
        flexShrink: 0,
    },
    rightDrawerPaper: {
        width: rightDrawerWidth,
    },
    right: {
        marginLeft: 'auto',
        marginRight: 0,
    },
    hide: {
        display: 'none',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${leftDrawerWidth}px)`,
        marginLeft: leftDrawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
}));

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

function DeepmechNav() {
    const [openLeft, setOpenLeft] = React.useState(false);
    const [openRight, setOpenRight] = React.useState(false);
    const [gravity, setGravity] = React.useState(false);
    const [pausing, setPausing] = React.useState(true);

    const toggleLeftDrawer = () => {
        setOpenLeft(!openLeft);
    };

    const toggleRightDrawer = () => {
        setOpenRight(!openRight);
    }

    const ref = mecElement;

    const run = () => {
        setPausing(!ref.pausing);
        mecElement.run();
    }

    const toggleGravity = () => {
        setGravity(!ref.gravity);
        mecElement.toggleGravity();
    }

    const classes = useStyle();

    return (
        <div className={classes.root}>
            <Drawer
                className={classes.leftDrawer}
                classes={{ paper: classes.leftDrawerPaper }}
                open={openLeft}
                anchor="left"
                variant="persistent">
                <List>
                    <ListItem onClick={toggleLeftDrawer}>
                        <ChevronLeftIcon />
                    </ListItem>
                    <ListItem onClick={run}>
                        {pausing ? <PlayArrowIcon /> : <PauseIcon />}
                    </ListItem>
                    <ListItem onClick={toggleGravity}>
                        g {gravity ? <ClearIcon /> : <ArrowDownwardIcon />}
                    </ListItem>
                    <ListItem onClick={ref.reset}>
                        <RotateLeftIcon />
                    </ListItem>
                </List>
            </Drawer>
            <Drawer
                className={classes.rightDrawer}
                classes={{ paper: classes.rightDrawerPaper }}
                open={openRight}
                anchor="right"
                variant="persistent">
                <List>
                    <ListItem onClick={toggleRightDrawer}>
                        <ChevronRightIcon />
                    </ListItem>
                    {Object.entries(JSON.parse(mecElement._model.asJSON())).map(list => (
                        <Accordion>
                            <AccordionSummary>
                                {list[0]}
                            </AccordionSummary>
                            <AccordionDetails>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                {createHeader(list[1]).map(key => (<TableCell><b>{key}</b></TableCell>))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {list[1].map && list[1].map(elm => (<TableRow>
                                                {Object.values(elm).map(val => (<TableCell>{sanitizeValue(val)}</TableCell>))}
                                            </TableRow>))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </List>
            </Drawer>
            <AppBar position="fixed"
                className={clsx(classes.appBar, { [classes.appBarShift]: openLeft, })}>
                <Grid container direction="row">
                    <IconButton
                        onClick={toggleLeftDrawer}
                        className={clsx(classes.menuButton, openLeft && classes.hide)} >
                        <ChevronRightIcon />
                    </IconButton>
                    <h3>&nbsp; 🚧 Work in progress 🚧 </h3>
                    <IconButton
                        onClick={toggleRightDrawer}
                        className={clsx(classes.right, classes.menuButton, openRight && classes.hide)} >
                        <ChevronLeftIcon />
                    </IconButton>
                </Grid>
            </AppBar>
        </div>
    );
}

ReactDOM.render(<DeepmechNav />, document.getElementById('deepmech_nav'))

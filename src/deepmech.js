import React from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
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
import { makeStyles, useTheme } from '@material-ui/core/styles';

const drawerWidth = 100;

const useStyle = makeStyles((theme) => ({
    root: {
        display: 'flex'
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
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
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
}));

function DeepmechNav() {
    const [open, setOpen] = React.useState(false);
    const [gravity, setGravity] = React.useState(false);
    const [pausing, setPausing] = React.useState(true);

    const toggleDrawer = () => {
        setOpen(!open);
    };

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
                className={classes.drawer}
                classes={{
                    paper: classes.drawerPaper,
                }}
                open={open}
                anchor="left"
                variant="persistent">
                <List>

                    <ListItem onClick={toggleDrawer}>
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
            <AppBar position="fixed"
                className={clsx(classes.appBar, { [classes.appBarShift]: open, })}>
                <Grid container direction="row">
                    <IconButton
                        onClick={toggleDrawer}
                        className={clsx(classes.menuButton, open && classes.hide)} >
                        <ChevronRightIcon />
                    </IconButton>
                    <h3>&nbsp; 🚧 Work in progress 🚧 </h3>
                </Grid>
            </AppBar>
        </div>
    );
}

ReactDOM.render(<DeepmechNav />, document.getElementById('deepmech_nav'))

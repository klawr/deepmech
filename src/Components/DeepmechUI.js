import React from 'react';

import Grid from '@material-ui/core/Grid';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';

import useStyle from '../style';
import LeftDrawer from './LeftDrawer';
import RightDrawer from './RightDrawer';
import DeepmechDraw from './DeepmechDraw';
import ListButton from './ListButton';

export default function DeepmechUI(props) {
    const [state, toggleState] = React.useState({
        left: false,
        right: false,
        drawing: false,
        dark: false,
    });

    const cnv = props.mec2._root.childNodes[3].childNodes[1];

    function toggleDarkMode(bool) {
        toggleState({ ...state, dark: bool });
        props.mec2._show.darkmode = bool;
        // TODO this should be done by mec2...
        cnv.style.backgroundColor = bool ? '#777' : '#eee';
    }

    const openDrawer = (side) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        toggleState({ ...state, [side]: true });
    };

    const darkTheme = createMuiTheme({
        palette: {
            type: 'dark',
        },
    });

    const lightTheme = createMuiTheme({
        palette: {
            type: 'light',
        },
    });

    const classes = useStyle();

    return (
        <MuiThemeProvider theme={state.dark ? darkTheme : lightTheme}>
            <div className={classes.root}>
                <DeepmechDraw
                    classes={classes}
                    state={state} />
                <LeftDrawer
                    classes={classes}
                    mec2={props.mec2}
                    state={state}
                    toggleDarkMode={toggleDarkMode}
                    toggleState={toggleState} />
                <RightDrawer
                    classes={classes}
                    mec2={props.mec2}
                    state={state}
                    toggleState={toggleState} />
                <Grid container direction="row"
                    className={classes.buttonGrid}>
                    <ListButton
                        onClick={openDrawer('left')}
                        tooltip="Open left drawer">
                        <ChevronRightIcon />
                    </ListButton>
                    <h3>&nbsp; 🚧 WIP 🚧 </h3>
                    <ListButton
                        onClick={openDrawer("right")}
                        tooltip="Open right drawer"
                        className={classes.right} >
                        <ChevronLeftIcon />
                    </ListButton>
                </Grid>
            </div>
        </MuiThemeProvider>
    );
}

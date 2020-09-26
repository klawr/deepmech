import React from 'react';
import { Grid } from '@material-ui/core';
import { ChevronLeft, ChevronRight } from '@material-ui/icons';
import { useStyle, LeftDrawer, RightDrawer, DeepmechCanvas, ListButton } from '.';
import {
    createMuiTheme,
    ThemeProvider as MuiThemeProvider
} from '@material-ui/core/styles';


export default function DeepmechUI({ mec2 }) {
    const dark = window.matchMedia ?
        window.matchMedia('(prefers-color-scheme: dark)').matches :
        false; // Default to light mode

    const [state, toggleState] = React.useState({
        left: false,
        right: false,
        drawing: false,
        dark: dark,
    });

    window.matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', event => {
            toggleState({ ...state, ['dark']: event.matches });
        });

    mec2._show.darkmode = state.dark;
    // TODO this should be done by mec2...
    const cnv = mec2._root.childNodes[3].childNodes[1];
    cnv.style.backgroundColor = state.dark ? '#777' : '#eee';

    const openDrawer = (side) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        toggleState({ ...state, [side]: true });
    };

    const darkTheme = createMuiTheme({ palette: { type: 'dark' } });
    const lightTheme = createMuiTheme({ palette: { type: 'light' } });

    const classes = useStyle();

    return (
        <MuiThemeProvider theme={state.dark ? darkTheme : lightTheme}>
            <div className={classes.root}>
                <div className={classes.drawElement} id="deepmech_canvas" />

                <LeftDrawer
                    classes={classes} mec2={mec2}
                    state={state} toggleState={toggleState} />
                <RightDrawer
                    classes={classes} mec2={mec2}
                    state={state} toggleState={toggleState} />
                <MuiThemeProvider theme={state.drawing || state.dark ? darkTheme : lightTheme}>
                    <Grid container direction="row"
                        className={classes.buttonGrid}>
                        <ListButton
                            onClick={openDrawer('left')}
                            tooltip="Open left drawer">
                            <ChevronRight />
                        </ListButton>
                        <h3>&nbsp; 🚧 WIP 🚧 </h3>
                        <ListButton
                            onClick={openDrawer("right")}
                            tooltip="Open right drawer"
                            className={classes.right} >
                            <ChevronLeft />
                        </ListButton>
                    </Grid>
                </MuiThemeProvider>
            </div>
        </MuiThemeProvider>
    );
}

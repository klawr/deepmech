import React from 'react';
import { Grid } from '@material-ui/core';
import { ChevronLeft, ChevronRight } from '@material-ui/icons';
import { useStyle, LeftDrawer, RightDrawer, ListButton } from '.';
import {
    createMuiTheme,
    ThemeProvider as MuiThemeProvider
} from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { UIselect, UIactions } from '../Features';

export default function DeepmechUI({ mec2 }) {
    const dispatch = useDispatch();
    const selectedDarkmode = useSelector(UIselect).darkmode;
    const selectedDeepmech = useSelector(UIselect).deepmech;
    const lightTheme = createMuiTheme({ palette: { type: 'light' } });
    const darkTheme = createMuiTheme({ palette: { type: 'dark' } });

    mec2._show.darkmode = selectedDarkmode;
    // TODO this should be done by mec2...
    const cnv = mec2._root.childNodes[3].childNodes[1];
    cnv.style.backgroundColor = selectedDarkmode ? '#777' : '#eee';

    const classes = useStyle();

    return (
        <MuiThemeProvider theme={selectedDarkmode ? darkTheme : lightTheme}>
            <div className={classes.root}>
                <div className={classes.drawElement} id="deepmech_canvas" />
                <LeftDrawer classes={classes} mec2={mec2} />
                <RightDrawer classes={classes} mec2={mec2} />
                <MuiThemeProvider theme={selectedDeepmech || selectedDarkmode ? darkTheme : lightTheme}>
                    <Grid container direction="row"
                        className={classes.buttonGrid}>
                        <ListButton
                            onClick={() => dispatch(UIactions.left(true))}
                            tooltip="Open left drawer">
                            <ChevronRight />
                        </ListButton>
                        <h3>&nbsp; 🚧 WIP 🚧 </h3>
                        <ListButton
                            onClick={() => dispatch(UIactions.right(true))}
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

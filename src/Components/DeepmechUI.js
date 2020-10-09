import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid } from '@material-ui/core';
import { ChevronLeft, ChevronRight } from '@material-ui/icons';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { DeepmechCanvas, LeftDrawer, RightDrawer, ListButton } from '.';
import { UIselect, UIactions } from '../Features';
import { lightTheme, darkTheme, useStyle } from '../style';

export default function DeepmechUI({ mec2 }) {
    const dispatch = useDispatch();
    const selectedDarkmode = useSelector(UIselect).darkmode;
    const selectedDeepmech = useSelector(UIselect).deepmech;

    mec2._show.darkmode = selectedDarkmode;
    mec2._ctx.canvas.style.backgroundColor = selectedDarkmode ? '#777' : '#eee';

    const placeholder = {
        ply: g2(),
        mec: g2().view(mec2._interactor.view).use({
            grp: () => ({
                commands: mec2._g.commands.filter(c =>
                    mec2._model.nodes.includes(c.a) ||
                    mec2._model.constraints.includes(c.a))
            })
        }),
        img: g2(),
    }

    const classes = useStyle();

    return (
        <MuiThemeProvider theme={selectedDarkmode ? darkTheme : lightTheme}>
            <div className={classes.root}>
                {selectedDeepmech &&
                    <DeepmechCanvas placeholder={placeholder} classes={classes} mec2={mec2} />}
                <LeftDrawer classes={classes} mec2={mec2} />
                <RightDrawer classes={classes} mec2={mec2} />
                <MuiThemeProvider theme={selectedDeepmech || selectedDarkmode ?
                    darkTheme : lightTheme}>
                    <Grid container direction="row"
                        className={classes.buttonGrid}>
                        <ListButton
                            onClick={() => dispatch(UIactions.left(true))}
                            tooltip="Open left drawer">
                            <ChevronRight />
                        </ListButton>
                        <h3>&nbsp; 🚧 WIP 🚧 </h3>
                        <ListButton
                            enabled={!selectedDeepmech}
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

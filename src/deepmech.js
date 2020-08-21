import React from 'react';
import ReactDOM from 'react-dom';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ClearIcon from '@material-ui/icons/Clear';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
// import { makeStyles, useTheme } from '@material-ui/core/styles';

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

    return (
        <div>
            <Drawer
                open={open}
                anchor="left"
                variant="persistent">
                <IconButton onClick={toggleDrawer}>
                    <ChevronLeftIcon />
                </IconButton>
                <IconButton onClick={run}>
                    {pausing ? <PlayArrowIcon /> : <PauseIcon />}
                </IconButton>
                <IconButton onClick={toggleGravity}>
                    g {gravity ? <ClearIcon /> : <ArrowDownwardIcon />}
                </IconButton>
                <IconButton onClick={ref.reset}>
                    <RotateLeftIcon />
                </IconButton>
            </Drawer>
            <Grid container direction="row">
                <IconButton onClick={toggleDrawer}>
                    <ChevronRightIcon />
                </IconButton>
                <h3> 🚧 Work in progress 🚧 </h3>
            </Grid>
        </div>
    );
}

ReactDOM.render(<DeepmechNav />, document.getElementById('deepmech_nav'))

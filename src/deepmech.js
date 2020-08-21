import React from 'react';
import ReactDOM from 'react-dom';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
// import { makeStyles, useTheme } from '@material-ui/core/styles';

function DeepmechNav() {
    const [open, setOpen] = React.useState(false);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <div>
            <Drawer
                open={open}
                anchor="left"
                variant="persistent">
                <IconButton onClick={toggleDrawer}>
                    <ChevronLeftIcon />
                </IconButton>
                <IconButton onClick={() => mecElement.run()}>
                    <PlayArrowIcon />
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

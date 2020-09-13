import { makeStyles, useTheme } from '@material-ui/core/styles';

const leftDrawerWidth = "auto";
const rightDrawerWidth = Math.min(250, globalThis.innerWidth);

export const useStyle = makeStyles((theme) => ({
    root: {
        display: 'flex'
    },
    buttonGrid: {
        position: 'absolute'
    },
    leftDrawer: {
        width: leftDrawerWidth,
        flexShrink: 0,
    },
    listBottom: {
        position: 'absolute',
        bottom: '0%'
    },
    right: {
        marginLeft: 'auto',
        marginRight: 0,
    },
    rightDrawer: {
        width: rightDrawerWidth,
    },
    hide: {
        display: 'none',
    },
    drawCanvas: {
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000',
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

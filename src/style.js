import { createMuiTheme, makeStyles } from '@material-ui/core/styles';

export const lightTheme = createMuiTheme({ palette: { type: 'light' } });
export const darkTheme = createMuiTheme({ palette: { type: 'dark' } });

export const useStyle = makeStyles(() => ({
    root: {
        display: 'flex'
    },
    buttonGrid: {
        pointerEvents: 'none',
        position: 'absolute',
        paddingTop: 8, // Stolen from MuiListPadding to align with drawer
    },
    listBottom: {
        position: 'relative',
        marginBottom: 0,
        marginTop: 'auto'
    },
    right: {
        marginLeft: 'auto',
        marginRight: 0,
    },
    hide: {
        display: 'none',
    },
    drawElement: {
        pointerEvents: 'none',
        position: 'absolute',
        width: '100vw',
        height: '100vh',
    },
    drawCanvas: {
        pointerEvents: 'all',
        backgroundColor: 'black', // NOTE #000c may be cool too
    }
}));

import { makeStyles } from '@material-ui/core/styles';

const useStyle = makeStyles(() => ({
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

export default useStyle;

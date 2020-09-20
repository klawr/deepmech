import { makeStyles } from '@material-ui/core/styles';

const useStyle = makeStyles(() => ({
    root: {
        display: 'flex'
    },
    buttonGrid: {
        position: 'absolute',
        paddingTop: 8, // Stolen from MuiListPadding to align with drawer
    },
    listBottom: {
        position: 'absolute',
        bottom: '0%'
    },
    right: {
        marginLeft: 'auto',
        marginRight: 0,
    },
    hide: {
        display: 'none',
    },
    drawCanvas: {
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000',
    },
}));

export default useStyle;

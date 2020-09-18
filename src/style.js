import { makeStyles, useTheme } from '@material-ui/core/styles';

const useStyle = makeStyles((theme) => ({
    root: {
        display: 'flex'
    },
    buttonGrid: {
        position: 'absolute'
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

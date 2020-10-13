import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { Grid } from '@material-ui/core';
import { ChevronLeft, ChevronRight } from '@material-ui/icons';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { store, UIselect, UIactions } from './Features';
import { lightTheme, darkTheme, useStyle } from './style';
import {
    DeepmechCanvas,
    LeftDrawer,
    RightDrawer,
    ListButton
} from './Components';

const ref = mecElement;

let selected = 0;
function handleMecModelUpdate() {
    const m = store.getState().MecModel;
    const s = m.selected;
    // selected is guaranteed to change on every action
    if (selected === s) return
    // if selected < s, the last action was an update, otherwise it was an undo
    const a = selected < s ? m.queue[s - 1] : m.queue[s];
    const model = ref._model;
    Object.entries(selected < s ? a.value : a.previous).forEach(e => {
        model[a.list][a.idx][e[0]] = e[1];
    });
    // TODO this should be done in mecElement
    model.constraints = model.constraints.map(c => {
        c.p1 = typeof c.p1 === 'object' ? c.p1 : model.nodeById(c.p1);
        c.p2 = typeof c.p2 === 'object' ? c.p2 : model.nodeById(c.p2);
        return c;
    });
    model.views = model.views.map(v => {
        v.of = typeof v.of === 'object' ? v.of : model.nodeById(v.of);
        return v;
    });
    model.preview();
    model.pose();
    ref.render();

    selected = s;
}

store.subscribe(handleMecModelUpdate);

// Let g2 beg simulate view (beg does not respect cartesian)
function begSimView({ x = 0, y = 0, scl = 1, cartesian = false }) {
    return {
        matrix: (cartesian ?
            [scl, 0, 0, -scl, x, ref._ctx.canvas.height - 1 - y] :
            [scl, 0, 0, scl, x, y])
    };
};

function App() {
    const dispatch = useDispatch();
    const selectedDarkmode = useSelector(UIselect).darkmode;
    const selectedDeepmech = useSelector(UIselect).deepmech;

    const placeholder = {
        ply: g2(),
        mec: g2().beg(begSimView(ref._interactor.view))
            .use({
                grp: () => ({
                    commands: ref._g.commands.filter(c =>
                        ref._model.nodes.includes(c.a) ||
                        ref._model.constraints.includes(c.a))
                })
            }).end(),
        img: g2(),
    }

    const classes = useStyle();

    return <MuiThemeProvider theme={selectedDarkmode ? darkTheme : lightTheme}>
        <div className={classes.root}>
            {selectedDeepmech &&
                <DeepmechCanvas placeholder={placeholder} classes={classes} />}
            <LeftDrawer classes={classes} mecReset={() => ref.reset()} />
            <RightDrawer classes={classes} />
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
}

ReactDOM.render(<Provider store={store}>
    <App />
</Provider>, document.getElementById('deepmech_nav'));
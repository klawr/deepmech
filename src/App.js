import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { Grid } from '@material-ui/core';
import { ChevronLeft, ChevronRight } from '@material-ui/icons';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { lightTheme, darkTheme, useStyle } from './style';
import { store, deepmechSelect, deepmechAction, UiSelect, UiAction, mecAction } from './Features';
import { DeepmechCanvas, LeftDrawer, RightDrawer, ListButton } from './Components';

const ref = mecElement;

let mecModel;
let counter = 0;
function handleMecModelUpdate() {
    if (mecModel === store.getState().MecModel) return;
    mecModel = store.getState().MecModel;
    // if true the last action was an update, otherwise it was an undo
    const up = counter < mecModel.selected;
    const action = up ? mecModel.queue[mecModel.selected - 1] :
        mecModel.queue[mecModel.selected];
    if (!action) return;

    if (typeof action.idx === 'number') {
        Object.entries(up ? action.value : action.previous).forEach(e => {
            ref._model[action.list][action.idx][e[0]] = e[1];
        });
    }
    else if (action.idx === 'add' || action.idx === 'remove') {
        // Check if element is going to be added (or removed)
        const add = (up && action.idx === 'add') || (!up && action.idx === 'remove');
        if (action.list === 'nodes' ||
            action.list === 'constraints' ||
            action.lists === 'views') {
            const element = { ...action.value };
            if (add) {
                if (ref._model[action.list].find(e => e.id === element.id)) {
                    // console.warn(`Can not add element to ${action.list}. Id ${element.id} is already taken`)
                    return;
                }
                ref._model.plugIns[action.list].extend(element);
                ref._model.add(action.list, element);
                element.init(ref._model);
            }
            else {
                // TODO why is this ? necessary?
                const o = ref._model[action.list].find(e => e.id === element.id);
                if (o) o.remove;
            }
        }
        // TODO this causes some issues...
        ref._model.draw(mecElement._g);
    }

    if (action.list === 'constraints') {
        // Skip updating nodes when the constraint is removed...
        if (action.idx === 'remove' && up) return

        ref._model.constraints.forEach(e => e.assignRefs());
    }
    if (action.list === 'views') {
        ref._model.views.forEach(e => e.assignRefs());
    }

    ref._model.preview();
    ref._model.pose();
    ref.render();

    counter = mecModel.selected;
}

store.subscribe(handleMecModelUpdate);

// Let g2 beg simulate view (beg does not respect cartesian)
function begSimView(v) {
    return {
        matrix() {
            return (v.cartesian ?
                [v.scl, 0, 0, -v.scl, v.x, ref._ctx.canvas.height - 1 - v.y] :
                [v.scl, 0, 0, v.scl, v.x, v.y]);
        }
    };
};

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

function App() {
    const dispatch = useDispatch();
    // Webview event handling:
    if (globalThis.chrome?.webview) {
        dispatch(deepmechAction.initiate());

        globalThis.webviewEventListenerPlaceholder = (o) => {
            if (o.register) {
                dispatch(deepmechAction.register({
                    canvas: o.register.canvas,
                    prediction: o.register.prediction
                }));
            }
            if (o.prediction) {
                dispatch(deepmechAction.updateModel(o.prediction));
            }
        }
    }
    dispatch(mecAction.initialize());
    const UI = useSelector(UiSelect);
    const deepmech = useSelector(deepmechSelect);

    const classes = useStyle();

    return <MuiThemeProvider theme={UI.darkmode ? darkTheme : lightTheme}>
        <div className={classes.root}>
            {deepmech.active &&
                <DeepmechCanvas placeholder={placeholder} classes={classes} />}
            <LeftDrawer classes={classes} mecReset={() => ref.reset()} />
            <RightDrawer classes={classes} />
            <MuiThemeProvider theme={deepmech.active || UI.darkmode ?
                darkTheme : lightTheme}>
                <Grid container direction="row"
                    className={classes.buttonGrid}>
                    <ListButton
                        onClick={() => dispatch(UiAction.left(true))}
                        tooltip="Open left drawer">
                        <ChevronRight />
                    </ListButton>
                    <h3>&nbsp; 🚧 WIP 🚧 </h3>
                    <ListButton
                        enabled={!deepmech.active}
                        onClick={() => dispatch(UiAction.right(true))}
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
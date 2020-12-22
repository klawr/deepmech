import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { Grid } from '@material-ui/core';
import { ChevronLeft, ChevronRight } from '@material-ui/icons';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { store, UiSelect, UiAction, mecAction } from './Features';
import { lightTheme, darkTheme, useStyle } from './style';
import {
    DeepmechCanvas,
    LeftDrawer,
    RightDrawer,
    ListButton
} from './Components';
import { deepmech } from './deepmech';

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
        if (action.list === 'nodes') {
            if (add) {
                const node = { ...action.value };
                if (ref._model.nodeById(node.id)) {
                    console.warn(`Can not create node.\nid "${node.id}" is already taken.`);
                    return;
                }
                mec.node.extend(node);
                ref._model.addNode(node);
                node.init(ref._model);
            }
            else {
                ref._model.removeNode(ref._model.nodeById(action.value.id));
            }
        }
        else if (action.list === 'constraints') {
            if (add) {
                const constraint = { ...action.value };
                if (ref._model.constraintById(constraint.id)) {
                    // console.warn(`Can not create constraint\nid "${constraint.id}" is already taken.`);
                    return;
                }
                mec.constraint.extend(constraint);
                ref._model.addConstraint(constraint);
                constraint.init(ref._model);
            }
            else {
                ref._model.removeConstraint(ref._model.constraintById(action.value.id));
            }
        }
        // TODO this causes some issues...
        ref._model.draw(mecElement._g);
    }

    // Replace nodes given as Id with respective objects.
    // The object itself can't be given to the payload, because of the
    // altered prototype
    function checkForNode(list, idx, ...node) {
        const t = up ? action.value : action.previous;
        node.filter(p => typeof t[p] === 'string')
            .forEach(p => {
                ref._model[list][idx][p] = ref._model.nodeById(t[p]);
            });
    }
    if (action.list === 'constraints') {
        // Skip updating nodes when the constraint is removed...
        if (action.idx === 'remove' && up) {
            return;
        }
        const idx = action.idx === 'add' || action.idx === 'remove' ?
            ref._model.constraints.length - 1 : action.idx;
        checkForNode('constraints', idx, 'p1', 'p2')
    }
    if (action.list === 'views') {
        checkForNode('views', action.idx, 'of');
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

    // If webview component in App is used, enable communication via this
    // temporary solution:
    if (window.chrome?.webview) {
        window.webviewEventListenerPlaceholder = (o) => {
            if (!o) return;
            
            if (Object.keys(o).includes('deepmech')) {
                dispatch(UiAction.deepmech(o.deepmech));
            }

            // The layout of 'update' is defined in the predict.py used by
            // the webview provider
            if (Object.keys(o).includes('update')) {
                deepmech.updateNodes(o.update.nodes);
                deepmech.updateConstraints(o.update.constraints);

                mecElement._model.draw(mecElement._g);
            }
        }
    }

    dispatch(mecAction.initialize());
    const UI = useSelector(UiSelect);

    const classes = useStyle();

    return <MuiThemeProvider theme={UI.darkmode ? darkTheme : lightTheme}>
        <div className={classes.root}>
            {UI.deepmech &&
                <DeepmechCanvas placeholder={placeholder} classes={classes} />}
            <LeftDrawer classes={classes} mecReset={() => ref.reset()} />
            <RightDrawer classes={classes} />
            <MuiThemeProvider theme={UI.deepmech || UI.darkmode ?
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
                        enabled={!UI.deepmech}
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
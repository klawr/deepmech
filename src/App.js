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

const ref = mecElement;

let counter = 0;
function handleMecModelUpdate() {
    const mecModel = store.getState().MecModel;
    const select = mecModel.selected;
    // selected is guaranteed to change on every action
    if (counter === select) return
    // if selected < s, the last action was an update, otherwise it was an undo
    const action = counter < select ? mecModel.queue[select - 1] : mecModel.queue[select];
    const step = counter < select ? action.value : action.previous;

    if (typeof action.idx === 'number') {
        Object.entries(step).forEach(e => {
            ref._model[action.list][action.idx][e[0]] = e[1]
        });
    } else if (action.idx === 'add') {
        if (action.list === 'nodes') {
            if (counter < select) {
                const node = { ...step };
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
        } else if (action.list === 'constraints') {
            if (counter < select) {
                const constraint = { ...step };
                if (ref._model.constraintById(constraint.id)) {
                    console.warn(`Can not create constraint\nid "${constraint.id}" is already taken.`);
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
        node.filter(p => typeof step[p] === 'string')
            .forEach(p => {
                ref._model[list][idx][p] = ref._model.nodeById(step[p])
            });
    }
    if (action.list === 'constraints') {
        const idx = action.idx === 'add' ?
            ref._model.constraints.length - 1 : action.idx;
        checkForNode('constraints', idx, 'p1', 'p2')
    }
    if (action.list === 'views') {
        checkForNode('views', action.idx, 'of');
    }

    ref._model.preview();
    ref._model.pose();
    ref.render();

    counter = select;
}

store.subscribe(handleMecModelUpdate);

// Let g2 beg simulate view (beg does not respect cartesian)
function begSimView(v) {
    return {
        matrix() {
            return (v.cartesian ?
                [v.scl, 0, 0, -v.scl, v.x, ref._ctx.canvas.height - 1 - v.y] :
                [v.scl, 0, 0, v.scl, v.x, v.y])
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
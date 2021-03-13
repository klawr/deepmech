import './App.css';
import LeftDrawer from './Components/LeftDrawer';
import { Grid } from '@material-ui/core';
import ListButton from './Components/Utils/ListButton';
import { ChevronLeft, ChevronRight } from '@material-ui/icons';
import { useDispatch } from 'react-redux';
import { UIAction } from './Features/UISlice';
import store from './Features/store';
import RightDrawer from './Components/RightDrawer';

const ref = (globalThis as any).mecElement as any;

let mecModel: any;
let counter = 0;

function handleMecModelUpdate() {
  if (mecModel === store.getState().MecModel) return;
  mecModel = store.getState().MecModel;
  // if true the last action was an update, otherwise it was an undo
  const up = counter < mecModel.selected;
  const action = up
    ? mecModel.queue[mecModel.selected - 1]
    : mecModel.queue[mecModel.selected];
  if (!action) return;

  if (typeof action.idx === "number") {
    Object.entries(up ? action.value : action.previous).forEach((e) => {
      ref._model[action.list][action.idx][e[0]] = e[1];
    });
  } else if (action.idx === "add" || action.idx === "remove") {
    // Check if element is going to be added (or removed)
    const add =
      (up && action.idx === "add") || (!up && action.idx === "remove");
    if (
      action.list === "nodes" ||
      action.list === "constraints" ||
      action.lists === "views"
    ) {
      const element = { ...action.value };
      if (add) {
        if (ref._model[action.list].find((e: any) => e.id === element.id)) {
          // console.warn(`Can not add element to ${action.list}. Id ${element.id} is already taken`)
          return;
        }
        ref._model.plugIns[action.list].extend(element);
        ref._model.add(action.list, element);
        element.init(ref._model);
      } else {
        // TODO why is this ? necessary?
        const o = ref._model[action.list].find((e: any) => e.id === element.id);
        if (o) o.remove();
      }
    }
    // TODO this causes some issues...
    ref._model.draw(ref._g);
  }

  if (action.list === "constraints") {
    // Skip updating nodes when the constraint is removed...
    if (action.idx === "remove" && up) return;

    ref._model.constraints.forEach((e: any) => e.assignRefs());
  }
  if (action.list === "views") {
    ref._model.views.forEach((e: any) => e.assignRefs());
  }

  ref._model.preview();
  ref._model.pose();
  ref.render();

  counter = mecModel.selected;
}

store.subscribe(handleMecModelUpdate);

// Let g2 beg simulate view (beg does not respect cartesian)
function begSimView(v: any) {
  return {
    matrix() {
      return v.cartesian
        ? [v.scl, 0, 0, -v.scl, v.x, ref._ctx.canvas.height - 1 - v.y]
        : [v.scl, 0, 0, v.scl, v.x, v.y];
    },
  };
}

export default function App() {
  const dispatch = useDispatch();

  return (
    <div>
      <LeftDrawer />
      <RightDrawer />
      <Grid container direction="row">
        <ListButton
          onClick={() => dispatch(UIAction.left(true))}
          tooltip="Open drawer">
          <ChevronRight />
        </ListButton>
        <ListButton
          onClick={() => dispatch(UIAction.right(true))}
          tooltip="Open right drawer">
          <ChevronLeft />
        </ListButton>
      </Grid>
    </div>
  );
}

    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.tsx</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
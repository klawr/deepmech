import './App.css';
import LeftDrawer from './Components/LeftDrawer';
import { Grid } from '@material-ui/core';
import ListButton from './Components/Utils/ListButton';
import { ChevronLeft, ChevronRight } from '@material-ui/icons';
import { useDispatch } from 'react-redux';
import { UIAction } from './Redux/UISlice';
import store from './Redux/store';
import RightDrawer from './Components/RightDrawer';
import mecElementSingleton from './Services/Singletons/mecElement';
import handleMecModelUpdate from './Services/handleMecModelUpdate';

const ref = mecElementSingleton();

store.subscribe(() => handleMecModelUpdate(store, ref));

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
    <div className="root">
      <LeftDrawer />
      <RightDrawer />
      <Grid
        className="buttonGrid"
        container
        direction="row">
        <ListButton
          onClick={() => dispatch(UIAction.left(true))}
          tooltip="Open drawer">
          <ChevronRight />
        </ListButton>
        <ListButton
          className="rightDrawerButton"
          onClick={() => dispatch(UIAction.right(true))}
          tooltip="Open right drawer">
          <ChevronLeft />
        </ListButton>
      </Grid>
    </div>
  );
}

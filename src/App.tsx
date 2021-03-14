import './App.css';
import LeftDrawer from './Components/LeftDrawer';
import { Grid } from '@material-ui/core';
import ListButton from './Components/Utils/ListButton';
import { ChevronLeft, ChevronRight } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { UIAction } from './Redux/UISlice';
import store from './Redux/store';
import RightDrawer from './Components/RightDrawer';
import mecElementSingleton from './Services/Singletons/mecElement';
import handleMecModelUpdate from './Services/handleMecModelUpdate';
import { deepmechSelect } from './Redux/DeepmechSlice';
import DeepmechCanvas from './Components/Deepmech/DeepmechCanvas';

const ref = mecElementSingleton();

store.subscribe(() => handleMecModelUpdate(store, ref));

export default function App() {
  const dispatch = useDispatch();
  const deepmech = useSelector(deepmechSelect);

  return (
    <div className="root">
      <LeftDrawer />
      <RightDrawer />
      {deepmech.active && <DeepmechCanvas />}
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

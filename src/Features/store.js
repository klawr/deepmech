import { configureStore } from '@reduxjs/toolkit';
import UIReducer from './UiSlice';
import DeepmechReducer from './DeepmechSlice';
import MecModelReducer from './MecModelSlice';

export default configureStore({
    reducer: {
        UI: UIReducer,
        Deepmech: DeepmechReducer,
        MecModel: MecModelReducer,
    },
});

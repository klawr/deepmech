import { configureStore } from '@reduxjs/toolkit';
import UIReducer from './UISlice';
import DeepmechReducer from './DeepmechSlice';

export default configureStore({
    reducer: {
        UI: UIReducer,
        Deepmech: DeepmechReducer,
    },
});

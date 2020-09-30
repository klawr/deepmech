import { configureStore } from '@reduxjs/toolkit';
import UIReducer from './UISlice';

export default configureStore({
    reducer: {
        UI: UIReducer,
    },
});

import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
    name: 'Deepmech',
    initialState: {
        mode: 'draw',
    },
    reducers: {
        changeMode: (state, action) => {
            state.mode = action.payload;
        }
    },
});

export const deepmechAction = slice.actions;
export const deepmechSelect = state => state.Deepmech;

export default slice.reducer;

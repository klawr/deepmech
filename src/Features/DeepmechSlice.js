import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
    name: 'Deepmech',
    initialState: {
        mode: 'draw',
        canvas: undefined,
    },
    reducers: {
        changeMode: (state, action) => {
            state.mode = action.payload;
        },
        updateCanvas: (state, action) => {
            state.canvas = action.payload;
        },
    },
});

export const deepmechAction = slice.actions;
export const deepmechSelect = state => state.Deepmech;

export default slice.reducer;

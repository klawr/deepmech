import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
    name: 'UI',
    initialState: {
        left: false,
        right: false,
        deepmech: false,
        darkmode: window.matchMedia ?
            window.matchMedia('(prefers-color-scheme: dark)').matches ?
            true : false : false,
    },
    reducers: {
        left: (state, action) => {
            state.left = action.payload;
        },
        right: (state, action) => {
            state.right = action.payload;
        },
        deepmech: (state, action) => {
            state.deepmech = action.payload;
        },
        darkmode: (state, action) => {
            state.darkmode = action.payload;
        },
    },
});

export const { left, right, deepmech, darkmode } = slice.actions;

export const selectLeft = state => state.UI.left;
export const selectRight = state => state.UI.right;
export const selectDeepmech = state => state.UI.deepmech;
export const selectDarkmode = state => state.UI.darkmode;

export default slice.reducer;

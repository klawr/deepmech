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

export const actions = slice.actions;
export const select = state => state.UI;

export default slice.reducer;

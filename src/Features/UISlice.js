import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
    name: 'UI',
    initialState: {
        left: false,
        right: false,
        properties: {
            nodes: {
                id: true,
                x: true,
                y: true,
                base: true,
            },
            constraints: {
                id: true,
                p1: true,
                p2: true,
                len: true,
                ori: true,
            },
            views: {
                show: true,
                of: true,
                as: true,
            },
        },
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
        updateProperty: (state, action) => {
            const pl = action.payload;
            state.properties[pl.property][pl.label] = pl.value;
        }
    },
});

export const UiAction = slice.actions;
export const UiSelect = state => state.UI;

export default slice.reducer;

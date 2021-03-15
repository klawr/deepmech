import { createSlice } from '@reduxjs/toolkit';
import { IStore } from './store';

export type UIState = typeof initialState;
const initialState = {
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
    darkmode: window.matchMedia ?
        window.matchMedia('(prefers-color-scheme: dark)').matches ?
            true : false : false,
};

const slice = createSlice({
    name: "UI",
    initialState,
    reducers: {
        left: (state, action) => {
            state.left = action.payload;
        },
        right: (state, action) => {
            state.right = action.payload;
        },
        darkmode: (state, action) => {
            state.darkmode = action.payload;
        },
        updateProperty: (state, action) => {
            const pl = action.payload;
            const pr = state.properties as any;
            pr[pl.property][pl.label] = pl.value;
        }
    },
});

export const UIAction = slice.actions;
export const UISelect = (store: IStore) => store.UI;

export default slice.reducer;
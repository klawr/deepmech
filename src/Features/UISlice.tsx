import { createSlice } from '@reduxjs/toolkit';
import { IStore } from './store';

export interface IUIState {
    left: boolean,
    right: boolean,
    properties: any,
    darkmode: boolean,
}

const slice = createSlice({
    name: "UI",
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
        darkmode: window.matchMedia ?
            window.matchMedia('(prefers-color-scheme: dark)').matches ?
                true : false : false,
    } as IUIState,
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
            state.properties[pl.property][pl.label] = pl.value;
        }
    },
});

export const UIAction = slice.actions;
export const UISelect = (store: IStore) => store.UI;

export default slice.reducer;
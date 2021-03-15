import { createSlice } from "@reduxjs/toolkit";
import { IStore } from "./store";

export type DeepmechState = typeof initialState;
const initialState = {
    active: false,
    extern: {
        canvas: false,
        predict: false,
    },
    mode: "draw", // TODO make this an enum
};

const slice = createSlice({
    name: "Deepmech",
    initialState,
    reducers: {
        active: (state, action) => {
            if (!state.extern.canvas) {
                state.active = action.payload;
                return;
            }
        },
        changeMode: (state, action) => {
            state.mode = action.payload;
        },
        predict: (state) => {
            // TODO
        }
    }
});

export const deepmechAction = slice.actions;
export const deepmechSelect = (store: IStore) => store.Deepmech;

export default slice.reducer;
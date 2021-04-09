import { createSlice } from "@reduxjs/toolkit";
import deepmechPredict from "../Services/deepmech/deepmech";
import { IStore } from "./store";

export type DeepmechState = typeof initialState;
const initialState = {
    active: false,
    extern: {
        canvas: false,
        predict: false,
    },
    canvas: "DeepmechCanvasIdUsedToAccessThroughReduxState", // TODO maybe there is a better way?
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
            if (state.extern.canvas) return;
            const canvas = document.getElementById(state.canvas) as HTMLCanvasElement;
            if (canvas && !state.extern.predict) {
                deepmechPredict(canvas);
                return;
            }
        }
    }
});

export const deepmechAction = slice.actions;
export const deepmechSelect = (store: IStore) => store.Deepmech;

export default slice.reducer;
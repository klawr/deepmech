import { createSlice } from "@reduxjs/toolkit";
import { IStore } from "./store";

export interface IDeepmechState {
    active: boolean,
    extern: {
        canvas: boolean,
        predict: boolean,
    },
    mode: string, // TODO make enum
}

const slice = createSlice({
    name: "Deepmech",
    initialState: {
        active: false,
        extern: {
            canvas: false,
            predict: false,
        },
        mode: "draw"
    } as IDeepmechState,
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
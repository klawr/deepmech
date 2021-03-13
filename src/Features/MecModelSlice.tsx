import { createSlice } from '@reduxjs/toolkit';
import { IStore } from './store';

export interface MecModelAction { }

export interface IMecModelState {
    queue: Array<MecModelAction>,
    selected: number,
    id: string,
    pausing: boolean,
    gravity: boolean,
    darkmode: boolean,
    nodeLabels: boolean,
    constraintLabels: boolean,
    grid: boolean,
}

const slice = createSlice({
    name: "MecModel",
    initialState: {
        queue: [],
        selected: 0,
        id: "",
        pausing: true,
        gravity: false,
        darkmode: false,
        nodeLabels: true,
        constraintLabels: true,
        grid: false,
    } as IMecModelState,
    reducers: {
        toggleGravity: (state) => {
            state.gravity = !state.gravity;
        },
        setNodeLabels: (state, action) => {
            state.nodeLabels = action.payload;
        },
        setConstraintLabels: (state, action) => {
            state.constraintLabels = action.payload;
        },
        pause: (state, action) => {
            state.pausing = action.payload;
        },
        togglePausing: (state) => {
            state.pausing = !state.pausing;
        },
        setDarkmode: (state, action) => {
            state.darkmode = action.payload;
        },
    }
});

export const mecModelAction = slice.actions;
export const mecModelSelect = (store: IStore) => store.MecModel;

export default slice.reducer;
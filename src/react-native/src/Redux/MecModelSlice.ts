import { createSlice } from '@reduxjs/toolkit';
import { IStore } from './store';
import { IMec2, IMecPlugins } from 'mec2-module';
import { model } from '../Services/model';
export class MecModelAction<K extends keyof IMec2, T = Partial<IMec2[K][number]>> {
    list: K;
    idx: number | string; // idx can be "add" or "remove"
    value: T;
    previous: T;

    constructor(list: K, idx: number | string, value: T, previous: T) {
        this.list = list;
        this.idx = idx;
        this.value = value;
        this.previous = previous;
    }
}

export type MecModelState = typeof initialState;
const initialState = {
    queue: [] as MecModelAction<keyof IMecPlugins>[],
    selected: 0,
    model,
    phi: 0,
    pausing: true,
    gravity: false,
    darkmode: false,
    nodeLabels: true,
    constraintLabels: true,
    grid: false,
};

// TODO Since model is part of redux now, we can implement undo redo in
// a redux way. https://redux.js.org/recipes/implementing-undo-history/

const slice = createSlice({
    name: "MecModel",
    initialState,
    reducers: {
        add: (state, action: { payload: MecModelAction<keyof IMecPlugins> }) => {
            // TODO this can be done sleeker...
            if (JSON.stringify(action.payload.value) ===
                JSON.stringify(action.payload.previous)) {
                return;
            }
            const selected = state.queue.push(action.payload);
            if (state.selected > selected) { // Regular update
                state.selected = selected
            }
            else { // Change after undo
                // Remove queue after the respective selected index
                state.queue = [...state.queue.slice(0, state.selected), state.queue.pop()] as any;
                state.selected = state.queue.length;
            }
            const pl = action.payload;

            for (const e of Object.entries(pl.value)) {
                state.model[pl.list][pl.idx][e[0]] = e[1];
            }
        },
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
        undo: (state) => {
            if (state.selected > 0) {
                state.selected -= 1;
            }
        },
        redo: (state) => {
            if (state.selected < state.queue.length) {
                state.selected += 1;
            }
        },
        updateId: (state, action) => {
            state.model.id = action.payload;
        },
        initialize: (state) => {
            // const ref = mecElementSingleton();
            // ref._show.darkmode = state.darkmode;
            // ref._ctx.canvas.style.backgroundColor = state.darkmode ? '#777' : '#eee';
            // ref._show.nodeLabels = state.nodeLabels;
            // ref._show.constraintLabels = state.constraintLabels;
            // ref.grid = state.grid;
            // state.id = mecModelSingleton().id;
        },
        updatePhi: (state: any, action: any) => {
            state.phi = action.payload;
        }
    }
});

export const mecModelAction = slice.actions;
export const mecModelSelect = (store: IStore) => store.MecModel;

export default slice.reducer;
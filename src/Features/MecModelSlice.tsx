import { createSlice } from '@reduxjs/toolkit';
import { IMecModel, IMecModelPlugIns } from '../Utils/mecModel';
import { IStore } from './store';

export class MecModelAction<K extends keyof IMecModel, T = Partial<IMecModel[K][number]>> {
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

export interface IMecModelState {
    queue: MecModelAction<keyof IMecModelPlugIns>[],
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
        add: (state, action) => {
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
    }
});

export const mecModelAction = slice.actions;
export const mecModelSelect = (store: IStore) => store.MecModel;

export default slice.reducer;
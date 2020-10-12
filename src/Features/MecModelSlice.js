import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
    name: 'MecModel',
    initialState: {
        queue: [],
        selected: 0,
        pause: true,
        darkmode: false,
        gravity: false,
    },
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
                state.queue = [...state.queue.slice(0, state.selected), state.queue.pop()];
                state.selected = state.queue.length;
            }
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
        run: (state) => {
            state.run = true;
        },
        pause: (state) => {
            state.pause = true;
        },
        toggleDarkmode: (state) => {
            state.darkmode = !state.darkmode;
        },
        toggleGravity: (state) =>{
            state.gravity = !state.gravity;
        },
    },
});

export const { add, undo, redo, run, pause, toggleDarkmode } = slice.actions;
export const selectQueue = state => state.MecModel.queue;
export const selectSelected = state => state.MecModel.selected;

export default slice.reducer;

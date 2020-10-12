import { createSlice } from '@reduxjs/toolkit';

const ref = mecElement;

export const slice = createSlice({
    name: 'MecModel',
    initialState: {
        queue: [],
        selected: 0,
        id: ref._model.id,
        pausing: ref.pausing,
        darkmode: ref._show.darkmode,
        gravity: ref.gravity,
        view: {
            x: ref.x0,
            y: ref.y0,
            cartesian: ref.cartesian,
        }
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
        toggleRun: (state) => {
            ref.pausing = !state.pausing;
            state.pausing = ref.pausing;
        },
        pause: (state) => {
            ref.pausing = true;
            state.pausing = ref.pausing;
        },
        toggleDarkmode: (state) => {
            state.darkmode = !state.darkmode;
            ref._show.darkmode = state.darkmode;
            ref._ctx.canvas.style.backgroundColor = state.darkmode ? '#777' : '#eee';
        },
        toggleGravity: (state) => {
            ref.gravity = !state.gravity;
            state.gravity = ref.gravity;
        },
        updateId: (state, action) => {
            ref._model.id = action.payload;
            state.id = ref._model.id;
        }
    },
});

export const {
    add,
    undo,
    redo,
    pause,
    toggleRun,
    toggleDarkmode,
    toggleGravity,
    updateId,
} = slice.actions;
export const selectQueue = state => state.MecModel.queue;
export const selectView = state => state.MecModel.view;
export const selectSelected = state => state.MecModel.selected;
export const selectPausing = state => state.MecModel.pausing;
export const selectGravity = state => state.MecModel.gravity;
export const selectId = state => state.MecModel.id;

export default slice.reducer;

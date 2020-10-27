import { createSlice } from '@reduxjs/toolkit';

const ref = mecElement;
function setRefDarkmode(bool) {
    ref._show.darkmode = bool;
    ref._ctx.canvas.style.backgroundColor = bool ? '#777' : '#eee';
    return bool;
}


export const slice = createSlice({
    name: 'MecModel',
    initialState: {
        queue: [],
        selected: 0,
        id: ref._model.id,
        pausing: ref.pausing,
        darkmode: setRefDarkmode(window.matchMedia ?
            window.matchMedia('(prefers-color-scheme: dark)').matches ?
                true : false : false),
        gravity: ref.gravity,
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
        darkmode: (state, action) => {
            state.darkmode = action.payload;
            setRefDarkmode(action.payload);
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

export const mecAction = slice.actions;
export const mecSelect = state => state.MecModel;

export default slice.reducer;

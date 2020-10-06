import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
    name: 'MecModel',
    initialState: {
        queue: [],
        selected: 0,
    },
    reducers: {
        add: (state, action) => {
            if (action.payload.value === action.payload.previous) {
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
        }
    },
});

export const { add, undo, redo } = slice.actions;
export const selectQueue = state => state.MecModel.queue;
export const selectSelected = state => state.MecModel.selected;

export default slice.reducer;

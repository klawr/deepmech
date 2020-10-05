import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
    name: 'MecModel',
    initialState: {
        queue: [],
        index: 0,
    },
    reducers: {
        add: (state, action) => {
            if (action.payload.value === action.payload.previous) {
                return;
            }
            state.index = state.queue.push(action.payload);
        },
    },
});

export const { add } = slice.actions;
export const selectQueue = state => state.MecModel.queue;

export default slice.reducer;

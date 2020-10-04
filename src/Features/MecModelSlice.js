import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
    name: 'MecModel',
    initialState: {
        queue: [],
    },
    reducers: {
        add: (state, action) => {
            if (action.payload.value === action.payload.previous) {
                return;
            }
            state.queue.push(action.payload);
        },
    },
});

export const { add } = slice.actions;
export const selectQueue = state => state.MecModel.queue;

export default slice.reducer;

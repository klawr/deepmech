import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
    name: 'Deepmech',
    initialState: {
        mode: 'draw',
    },
    reducers: {
        changeMode: (state, action) => {
            state.mode = action.payload;
        },
    },
});

export const { changeMode } = slice.actions;
export const selectMode = state => state.Deepmech.mode;

export default slice.reducer;

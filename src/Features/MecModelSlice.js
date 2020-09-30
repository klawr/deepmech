import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
    name: 'MecModel',
    initialState: {
        model: {},
    },
    reducers: {
        updateModel: (state, action) => {
            state.model = action.payload;
        }
    },
});

export const { updateModel } = slice.actions;
export const selectModel = state => state.MecModel.model;

export default slice.reducer;

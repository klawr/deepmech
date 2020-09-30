import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
    name: 'MecModel',
    initialState: {
        model: JSON.parse(mecElement._model.asJSON()),
    },
    reducers: {
        updateElement: (state, action) => {
            const pl = action.payload;
            state.model[pl.list][pl.idx][pl.property] = pl.value;
            mecElement._model[pl.list][pl.idx][pl.property] = pl.value;
            mecElement._model.init();
            mecElement._model.reset();
            mecElement.render();
        }
    },
});

export const { updateModel, updateElement } = slice.actions;
export const selectModel = state => state.MecModel.model;

export default slice.reducer;

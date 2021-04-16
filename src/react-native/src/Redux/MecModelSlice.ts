import { createSlice } from '@reduxjs/toolkit';
import { IStore } from './store';
import { IConstraint, IMecPlugIns, IModel } from 'mec2-module';
import { model } from '../Services/model';
import { MecElement } from '../Components/Mec2/Utils/Mec2Cell';
export interface MecModelAction<K extends keyof IMecPlugIns> {
    list: K;
    idx: number; // idx can be "add" or "remove"
    value: Partial<MecElement>;
    previous: Partial<MecElement>;
}

export type MecModelState = typeof initialState;
const initialState = {
    queue: [] as MecModelAction<keyof IMecPlugIns>[],
    selected: 0,
    model,
    phi: 0,
    pausing: true,
    gravity: false,
    darkmode: false,
    nodeLabels: true,
    constraintLabels: true,
    grid: false,
};

function edgeCases(model: IModel, payload: MecModelAction<keyof IMecPlugIns>): boolean {
    // short is used to stop creating this payload. It is invalid and should not be added
    let short = false;
    if (payload.idx === -1) {
        if (payload.list === 'constraints') {
            if (payload.value.len === null) payload.value.len = { type: 'free' };
            if (payload.value.ori === null) payload.value.ori = { type: 'free' };
        }
    }
    for (const pl of Object.entries(payload.value)) {
        const [property, value] = pl;

        if (property === 'id') {
            if (!value) {
                short = true;
            }
            else {
                // Check if property 'id' is unique.
                Object.values(model).filter(v => Array.isArray(v)).flat().every(
                    (e: any | MecElement, idx: number) => {
                        if (!short && e.id === value) {
                            console.warn(`id ${value} is already taken on ${payload.list} at index ${idx}`);
                            short = true;
                            return false;
                        }
                        return true;
                    });
            }
        }
        if (short) continue;

        if (payload.list === 'nodes') {
            if (property === 'id') {
                model.constraints.forEach((c: IConstraint, idx: number) => {
                    if (c.p1 === payload.previous[property]) c.p1 = value;
                    if (c.p2 === payload.previous[property]) c.p2 = value;
                });
            }
        }

        if (payload.list === 'constraints') {
            const constraint = model.constraints[payload.idx];
            if (payload.idx >= 0) {
                if (property === 'p1' && value === constraint.p2) constraint.p2 = constraint.p1;
                if (property === 'p2' && value === constraint.p1) constraint.p1 = constraint.p2;
            }
        }
    }

    return short;
}

// TODO Since model is part of redux now, we can implement undo redo in
// a redux way. https://redux.js.org/recipes/implementing-undo-history/

const slice = createSlice({
    name: "MecModel",
    initialState,
    reducers: {
        add: (state, action: { payload: MecModelAction<keyof IMecPlugIns> }) => {
            const pl = action.payload;

            const invalid = edgeCases(state.model, pl);
            if (invalid) return;

            // Add or remove action:
            if (pl.idx === -1) {
                state.model[pl.list]!.push(pl.value as any);
            }
            else {
                for (const e of Object.entries(pl.value || {})) {
                    state.model[pl.list]![pl.idx][e[0]] = e[1];
                }
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
        updateId: (state, action) => {
            state.model.id = action.payload;
        },
        initialize: (state) => {
            // const ref = mecElementSingleton();
            // ref._show.darkmode = state.darkmode;
            // ref._ctx.canvas.style.backgroundColor = state.darkmode ? '#777' : '#eee';
            // ref._show.nodeLabels = state.nodeLabels;
            // ref._show.constraintLabels = state.constraintLabels;
            // ref.grid = state.grid;
            // state.id = mecModelSingleton().id;
        },
        updatePhi: (state: any, action: any) => {
            state.phi = action.payload;
        }
    }
});

export const mecModelAction = slice.actions;
export const mecModelSelect = (store: IStore) => store.MecModel;

export default slice.reducer;
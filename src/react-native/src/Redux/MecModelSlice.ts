import { createSlice } from '@reduxjs/toolkit';
import { IStore } from './store';
import { IConstraint, IMecConstraintType, IMecPlugIns, IModel } from 'mec2-module';
import { model } from '../Services/model';
import { MecElement } from '../Components/Mec2/Utils/Mec2Cell';
export interface MecModelAction<K extends keyof IMecPlugIns> {
    list: K;
    idx: number; // idx can be "add" or "remove"
    value: Partial<MecElement>;
}

export type MecModelState = typeof initialState;
const initialState = {
    pastModels: <IModel[]>[],
    model,
    futureModels: <IModel[]>[],
    phi: 0,
};

function edgeCases(model: IModel, payload: MecModelAction<keyof IMecPlugIns>): boolean {
    // short is used to stop creating this payload. It is invalid and should not be added
    let short = false;
    if (payload.idx === -1) {
        if (payload.list === 'constraints') {
            if (payload.value.len === undefined) payload.value.len = { type: 'free' };
            if (payload.value.ori === undefined) payload.value.ori = { type: 'free' };
        }
    }
    for (const [property, value] of Object.entries(payload.value)) {
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
            if (property === 'id' && typeof value === 'string') {
                const previous = model.nodes[payload.idx].id;
                model.constraints.forEach((c: IConstraint) => {
                    if (c.p1 === previous) c.p1 = value;
                    if (c.p2 === previous) c.p2 = value;
                });
            }
        }

        if (payload.list === 'constraints') {
            const constraint = model.constraints[payload.idx];
            if (payload.idx >= 0) {
                if (property === 'p1' && value === constraint.p2) constraint.p2 = constraint.p1;
                if (property === 'p2' && value === constraint.p1) constraint.p1 = constraint.p2;
            }
            // There must not be two drives in the mechanism.
            if (property === 'ori' || property === 'len') {
                const v = <IMecConstraintType>value;
                if (v.type === 'drive') {
                    v.Dw = Math.PI * 2;
                    v.input = 1;
                    model.constraints.forEach((c: IConstraint) => {
                        if (c.len && c.len.type === 'drive') c.len.type = 'const';
                        if (c.ori && c.ori.type === 'drive') c.ori.type = 'free';
                    });
                }
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
            state.pastModels.push(JSON.parse(JSON.stringify(state.model)));
            state.futureModels = [];
            const pl = action.payload;

            const invalid = edgeCases(state.model, pl);
            if (invalid) return;

            if (pl.idx === -1) {
                state.model[pl.list]!.push(pl.value as any);
            }
            else if (!Object.keys(pl.value).length) {
                // TODO check if dependsOn is true.
                state.model[pl.list] = state.model[pl.list]!
                    .filter((_, i: number) => i !== pl.idx);
            }
            else {
                for (const e of Object.entries(pl.value || {})) {
                    state.model[pl.list]![pl.idx][e[0]] = e[1];
                }
            }

            state.phi = 0;
        },
        undo: (state) => {
            state.futureModels.push(state.model);
            if (state.pastModels.length) {
                state.model = state.pastModels.pop()!;
            }
        },
        redo: (state) => {
            state.pastModels.push(state.model);
            if (state.futureModels.length) {
                state.model = state.futureModels.shift()!;
            }
        },
        updateId: (state, action) => {
            state.model.id = action.payload;
        },
        updatePhi: (state: any, action: any) => {
            state.phi = action.payload;
        }
    }
});

export const mecModelAction = slice.actions;
export const mecModelSelect = (store: IStore) => store.MecModel;
export const mecModelSelectModel = (store: IStore) => store.MecModel.model;

export default slice.reducer;
import { EnhancedStore } from "@reduxjs/toolkit";
import { MecModelState } from "../Redux/MecModelSlice";
import { IMecElement } from "./Singletons/mecElement";
import { IMecProperty } from './Singletons/mecModel';

let mecModel: MecModelState | undefined;
let counter = 0;

export default function handleMecModelUpdate(store: EnhancedStore, ref: IMecElement) {
    // if mecModel did not change from last time, return
    if (mecModel === store.getState().MecModel) return;
    // Can't be undefined if false.
    mecModel = store.getState().MecModel as MecModelState;
    // if true the last action was an update, otherwise it was an undo
    const up = counter < mecModel.selected;
    const action = up
        ? mecModel.queue[mecModel.selected - 1]
        : mecModel.queue[mecModel.selected];
    if (!action) return;

    const list = ref._model[action.list];

    if (typeof action.idx === "number") {
        Object.entries(up ? action.value : action.previous).forEach((e: [string, IMecProperty]) => {
            const element = list[action.idx as number];
            (element as any)[e[0]] = e[1]; // sigh...
        });
    } else if (action.idx === "add" || action.idx === "remove") {
        // Check if element is going to be added (or removed)
        const add =
            (up && action.idx === "add") || (!up && action.idx === "remove");
        if (action.list === "nodes" ||
            action.list === "constraints" ||
            action.list === "views") {
            const element = { ...action.value } as IMecProperty;
            if (add) {
                if ((list as IMecProperty[]).find((e) => e.id === element.id)) {
                    // console.warn(`Can not add element to ${action.list}. Id ${element.id} is already taken`)
                    return;
                }
                ref._model.plugIns[action.list].extend(element);
                ref._model.add(action.list, element);
                element.init(ref._model);
            } else {
                // TODO why is this ? necessary?
                const o = (list as IMecProperty[]).find((e) => e.id === element.id);
                if (o) o.remove();
            }
        }
        // TODO this causes some issues...
        ref._model.draw(ref._g);
    }

    if (action.list === "constraints") {
        // Skip updating nodes when the constraint is removed...
        if (action.idx === "remove" && up) return;

        ref._model.constraints.forEach((e: any) => e.assignRefs());
    }
    if (action.list === "views") {
        ref._model.views.forEach((e: any) => e.assignRefs());
    }

    ref._model.preview();
    ref._model.pose();
    ref.render();

    counter = mecModel.selected;
}
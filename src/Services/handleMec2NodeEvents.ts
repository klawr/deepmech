import { Dispatch } from "react";
import { mecModelAction } from "../Redux/MecModelSlice";
import mecElementSingleton from "./Singletons/mecElement";
import { INode } from "./Singletons/mecModel";

interface Coordinate { x: number, y: number }

const mecElement = mecElementSingleton();

export default function handleMec2NodeEvents(dispatch: Dispatch<any>) {
    const name = "nodes";

    let previous: Coordinate | undefined;
    let value: Coordinate;
    let selection: INode;

    function deepmechNodeDown() {
        selection = mecElement._selector.selection;
        previous = { x: selection.x, y: selection.y };
    }

    function deepmechNodeDrag() {
        if (selection && "drag" in selection) {
            value = { x: selection.x, y: selection.y };
        }
    }

    function deepmechNodeUp() {
        if (!value) {
            previous = undefined;
            return;
        }
        dispatch(mecModelAction.add({
            list: name, idx: mecElement._model[name].indexOf(selection),
            value: { ...value }, previous: { ...previous }
        }));
    }

    const o = {
        pointerdown: deepmechNodeDown,
        drag: deepmechNodeDrag,
        pointerup: deepmechNodeUp
    }

    Object.entries(o).forEach(e => mecElement._interactor.on(...e));

    return () => {
        Object.entries(o).forEach(e => mecElement._interactor.remove(...e));
    }
}

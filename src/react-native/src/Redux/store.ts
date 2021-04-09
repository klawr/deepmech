import { configureStore } from "@reduxjs/toolkit";
import DeepmechSlice, { DeepmechState } from "./DeepmechSlice";
import MecModelSlice, { MecModelState } from "./MecModelSlice";
import UISlice, { UIState } from "./UISlice";

export interface IStore {
    UI: UIState,
    Deepmech: DeepmechState,
    MecModel: MecModelState,
}

export default configureStore({
    reducer: {
        UI: UISlice,
        Deepmech: DeepmechSlice,
        MecModel: MecModelSlice,
    },
});


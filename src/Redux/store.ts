import { configureStore, Reducer } from "@reduxjs/toolkit";
import DeepmechSlice, { IDeepmechState } from "./DeepmechSlice";
import MecModelSlice, { IMecModelState } from "./MecModelSlice";
import UISlice, { IUIState } from "./UISlice";

export interface IStore {
    UI: IUIState,
    Deepmech: IDeepmechState,
    MecModel: IMecModelState,
}

export default configureStore({
    reducer: {
        UI: UISlice,
        Deepmech: DeepmechSlice,
        MecModel: MecModelSlice,
    },
});


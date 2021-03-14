import { ICanvasInteractorInstance } from "./canvasInteractor";
import { IG2, IG2Selector } from "./g2";
import { IMecModel } from "./mecModel";

export interface IMecElement {
    _interactor: ICanvasInteractorInstance;
    _model: IMecModel;
    _selector: IG2Selector;
    _show: {
        darkmode: boolean;
        nodeLabels: boolean;
        constraintLabels: boolean;
    }
    grid: boolean;
    _g: IG2;
    render: () => void;
    _ctx: CanvasRenderingContext2D;
}

export default function mecElementSingleton(): IMecElement {
    return ((globalThis as any).mecElement as any);
}


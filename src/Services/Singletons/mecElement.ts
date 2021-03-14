import { ICanvasInteractorInstance } from "./canvasInteractor";
import { IG2 } from "./g2";
import { IMecModel } from "./mecModel";

export interface IMecElement {
    _interactor: ICanvasInteractorInstance;
    _model: IMecModel;
    _g: IG2;
    render: () => void;
    _ctx: CanvasRenderingContext2D;
}

export default function mecElementSingleton(): IMecElement {
    return ((globalThis as any).mecElement as any);
}


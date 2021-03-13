import mecElementSingleton from "./mecElement";

export interface CanvasInteractor {

}

export default function canvasInteractorSingleton(): CanvasInteractor {
    return mecElementSingleton()._interactor;
}


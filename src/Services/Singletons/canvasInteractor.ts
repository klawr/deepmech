
export interface ICanvasInteractorInstance {
    evt: { type: string, x: number, y: number };
    view: {
        cartesian: boolean,
        scl: number,
        x: number,
        y: number,
    };
    on(key: string, value: (e: any) => void): void;
    remove(key: string, value: (e: any) => void): void;
}

export interface ICanvasInteractor {
    add(arg: ICanvasInteractorInstance): void;
    create(ctx: CanvasRenderingContext2D, arg: Object): ICanvasInteractorInstance;
    remove(arg: ICanvasInteractorInstance): void;
}

export default function canvasInteractorSingleton(): ICanvasInteractor {
    return (globalThis as any).canvasInteractor as any;
}


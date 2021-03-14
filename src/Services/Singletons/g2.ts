
export interface IG2Selector {
    evt: {
        hit: any;
    },
    selection: any;
}

export interface IG2 {
    commands: { a: any, c: string }[];
    (): IG2;
    beg(arg: {
        x: number, y: number, scl: number
    } | (() => number[])): IG2;
    end(): IG2;
    clr(): IG2;
    del(arg?: number): IG2;
    ply(arg: {
        pts: { x: number, y: number }[],
        lw?: number, ls?: string, lc?: string, lj?: string,
    }): IG2;
    use(arg: Object): IG2;

    exe(ctx: CanvasRenderingContext2D | IG2Selector): void;
    selector(arg: Object): IG2Selector;
};

export default function g2Singleton(): IG2 {
    return (globalThis as any).g2 as any;
}

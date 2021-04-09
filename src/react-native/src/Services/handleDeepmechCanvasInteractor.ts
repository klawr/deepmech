
import g2BegSimView from "./g2BegSimView";
import canvasInteractorSingleton from "./Singletons/canvasInteractor";
import g2Singleton from "./Singletons/g2";
import mecElementSingleton from "./Singletons/mecElement";

const ref = mecElementSingleton();
const g2 = g2Singleton();

const placeholder = {
    ply: g2(),
    mec: g2()
        .beg(g2BegSimView(ref))
        .use({
            grp: () => ({
                commands: ref._g.commands.filter(
                    (c) =>
                        ref._model.nodes.includes(c.a) ||
                        ref._model.constraints.includes(c.a)
                ),
            }),
        })
        .end(),
    img: g2(),
};

// TODO put this function into a class to be able to scope the functions?

/**
 * This function is called in DeepmechCanvas to handle interactions.
 * It is called upon creation and everytime the deepmech-mode is changed.
 * @param ctx Canvas Context to work on
 * @param mode Mode which this function operates on (at the moment)
 * @param fn A function which is called in the returned function.
 * @returns A function which is called when DeepmechCanvas is dismissed.
 *          This is also the case when deepmech-mode changes.
 */
export default function handleDeepmechCanvasInteractor(
    ctx: CanvasRenderingContext2D, mode: string, fn: () => any) {

    const canvasInteractor = canvasInteractorSingleton();
    const interactor = canvasInteractor.create(ctx, {});
    canvasInteractor.add(interactor);

    const selector = g2.selector(interactor.evt);

    const o = { tick, pointerdown, pointerup, drag, click: pointerup }
    Object.entries(o).forEach(e => interactor.on(...e));

    // A reference to the polyline which is drawn at the moment
    let ply: {
        pts: Array<{ x: number, y: number }>,
        lw?: number,
        ls?: string,
        lc?: string,
        lj?: string,
        sh?: false | (string | number)[],
    } | undefined;
    // placeholder for theming later on?
    let plyShadow = [0, 0, 5, "white"];

    function render() {
        g2().clr().exe(ctx);
        Object.values(placeholder).forEach(q => { q.exe(ctx); });
        if (mode === 'camera') {
            ctx.drawImage(_video, 0, 0, ctx.canvas.width, ctx.canvas.height);
        };
    }

    function pointerdown(e: PointerEvent) {
        switch (mode) {
            case 'draw':
                // Set ply and add to command queue
                ply = {
                    pts: [{ x: e.x, y: e.y }],
                    lw: 2, ls: '#fff', lc: 'round', lj: 'round',
                    // TODO get sh() { return this.state & g2.OVER ? plyShadow : false; },
                };
                placeholder.ply.ply(ply);
                break;
            case 'delete':
                // Filter selected node from commands array
                placeholder.ply.commands = placeholder.ply.commands.filter(
                    (cmd: { a: string; }) => cmd.a !== selector.selection);
                selector.evt.hit = false; // selector gets confused
                selector.selection = false; // overwrite selection
                break;
        }
    }

    function pointerup() {
        // If pts is a point => remove ply
        if ((ply?.pts as any).length <= 1) {
            placeholder.ply.del(placeholder.ply.commands.length - 1);
        }
        // Reset ply
        ply = undefined;
    }

    function drag(e: any) { // TODO
        switch (mode) {
            case 'drag':
                if (selector.selection?.drag) {
                    selector.selection.drag({ dx: e.dxusr, dy: e.dyusr });
                }
                break;
        }
    }

    let _video = undefined as any; // TODO
    const selectCamera = document.createElement('select');
    function startCamera() {
        _video = document.createElement('video');
        _video.width = ctx.canvas.width;
        _video.height = ctx.canvas.height;
        _video.autoplay = true;

        navigator.mediaDevices.getUserMedia({
            video: { deviceId: selectCamera.value ? { exact: selectCamera.value } : undefined }
        }).then(s => {
            _video.srcObject = s;
            return navigator.mediaDevices.enumerateDevices();
        });
    }

    function tick() {
        let { type, x, y } = interactor.evt;
        switch (mode) {
            case 'camera':
                if (!_video) startCamera();
                break;
            case 'draw':
                if (type === 'pan' && ply) {
                    // Omit very small changes
                    const tolerance = 0.1;
                    const last = ply.pts[ply.pts.length - 1];
                    if (Math.hypot(x - last.x, y - last.y) > tolerance) {
                        ply.pts.push({ x, y });
                    }
                }
                break;
            case 'drag':
            case 'delete':
                placeholder.ply.exe(selector);
                break;
        }
        render();
    }

    return () => {
        Object.entries(o).forEach(e => interactor.remove(...e));
        canvasInteractor.remove(interactor);

        fn();
    };
}

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { deepmechSelect } from "../../Redux/DeepmechSlice";
import { mecModelAction, mecModelSelect } from "../../Redux/MecModelSlice";
import { UIAction } from "../../Redux/UISlice";

export default function DeepmechCanvas() {
    const deepmech = useSelector(deepmechSelect);
    const mec = useSelector(mecModelSelect);
    const dispatch = useDispatch();

    const placeholder = undefined; // TODO

    // dispatch(deepmechAction.updateCanvas(id));
    const canvasRef = React.useRef(null);
    React.useEffect(() => {
        const [nl, cl] = [mec.nodeLabels, mec.constraintLabels];
        dispatch(mecModelAction.setNodeLabels(false));
        dispatch(mecModelAction.setConstraintLabels(false));
        dispatch(UIAction.right(false));
        const ctx = (canvasRef.current as any).getContext('2d'); // TODO
        return handleInteractor(ctx, deepmech.mode, placeholder, () => {
            dispatch(mecModelAction.setNodeLabels(nl));
            dispatch(mecModelAction.setConstraintLabels(cl));
        });
    }, [deepmech.mode]);

    return <canvas
        width={globalThis.innerWidth} height={globalThis.innerHeight}
        ref={canvasRef} />
}

function handleInteractor(
    ctx: CanvasRenderingContext2D,
    mode: string,
    placeholder: any,
    fn: () => any) {
    // TODO const interactor = canvasInteractor.create(ctx, {});
    // canvasInteractor.add(interactor);
    // const selector = g2.selector(interactor.evt);
    let selector: any = {};

    const o = { tick, pointerdown, pointerup, drag, click: pointerup }
    // Object.entries(o).forEach(e => interactor.on(...e));

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
        // g2().clr().exe(ctx);
        // Object.values(placeholder).forEach(q => { q.exe(ctx); });
        // if (mode === 'camera') {
        //     ctx.drawImage(_video, 0, 0, ctx.canvas.width, ctx.canvas.height);
        // };
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
        // // Reset ply
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
        // TODO 
        let { type, x, y } = { "type": "pan", x: 20, y: 20 }; // interactor.evt;
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
        // TODO
        // Object.entries(o).forEach(e => interactor.remove(...e));
        // canvasInteractor.remove(interactor);

        fn();
    };
}

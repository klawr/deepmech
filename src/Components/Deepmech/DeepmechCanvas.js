import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { deepmechSelect, deepmechAction, UiAction } from '../../Features';

export default function DeepmechCanvas({ classes, placeholder }) {
    const deepmech = useSelector(deepmechSelect);

    const dispatch = useDispatch();
    const canvasRef = React.useRef(null);
    React.useEffect(() => {
        const ctx = canvasRef.current.getContext('2d');
        dispatch(UiAction.right(false));
        return handleInteractor(ctx, deepmech.mode, placeholder);
    });

    return <canvas
        id="deepmechCanvas"
        className={classes.drawCanvas}
        width={globalThis.innerWidth} height={globalThis.innerHeight}
        ref={canvasRef} />
}

function handleInteractor(ctx, mode, placeholder) {
    const interactor = canvasInteractor.create(ctx, {});
    canvasInteractor.add(interactor);
    const selector = g2.selector(interactor.evt);

    const o = { tick, pointerdown, pointerup, drag, click: pointerup }
    Object.entries(o).forEach(e => interactor.on(...e));

    // A reference to the polyline which is drawn at the moment
    let ply;
    // placeholder for theming later on?
    let plyShadow = [0, 0, 5, "white"];

    function render() {
        g2().clr().exe(ctx);
        Object.values(placeholder).forEach(q => { q.exe(ctx); });
        if (mode === 'camera') {
            ctx.drawImage(_video, 0, 0, ctx.canvas.width, ctx.canvas.height);
        };
    }

    function pointerdown(e) {
        switch (mode) {
            case 'draw':
                // Set ply and add to command queue
                ply = {
                    pts: [{ x: e.x, y: e.y }],
                    lw: '2', ls: '#fff', lc: 'round', lj: 'round',
                    get sh() { return this.state & g2.OVER ? plyShadow : false; },
                };
                placeholder.ply.ply(ply);
                break;
            case 'delete':
                // Filter selected node from commands array
                placeholder.ply.commands = placeholder.ply.commands.filter(
                    cmd => cmd.a !== selector.selection);
                selector.evt.hit = false; // selector gets confused
                selector.selection = false; // overwrite selection
                break;
        }
    }

    function pointerup() {
        // If pts is a point => remove ply
        if (ply?.pts?.length <= 1) {
            placeholder.ply.del(placeholder.ply.commands.length - 1);
        }
        // // Reset ply
        ply = undefined;
    }

    function drag(e) {
        switch (mode) {
            case 'drag':
                // console.log(interactor.evt)
                if (selector.selection?.drag) {
                    selector.selection.drag({ dx: e.dxusr, dy: e.dyusr });
                }
                break;
        }
    }

    let _video = undefined;
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
    };
}
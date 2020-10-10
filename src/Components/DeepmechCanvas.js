import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { selectMode, UIactions } from '../Features';

export default function DeepmechCanvas({ mec2, classes, placeholder }) {
    const mode = useSelector(selectMode);

    const dispatch = useDispatch();
    const canvasRef = React.useRef(null);
    React.useEffect(() => {
        const ctx = canvasRef.current.getContext('2d');
        dispatch(UIactions.right(false))
        return handleInteractor(ctx, mec2, mode, placeholder);
    });

    return <canvas
        className={classes.drawCanvas}
        width={globalThis.innerWidth} height={globalThis.innerHeight}
        ref={canvasRef} />
}

function handleInteractor(ctx, mec2, mode, placeholder) {
    const interactor = canvasInteractor.create(ctx, {
        x: mec2.x0, y: mec2.y0, cartesian: mec2.cartesian
    });
    canvasInteractor.add(interactor);
    const selector = g2.selector(interactor.evt);

    const o = { tick, pointerdown, pointerup, drag, click: pointerup }
    Object.entries(o).forEach(e => interactor.on(...e));

    const view = mec2._interactor.view;

    // A reference to the polyline which is drawn at the moment
    let ply;
    // placeholder for theming later on?
    let plyShadow = "white";

    function render() {
        g2().clr().exe(ctx);
        Object.values(placeholder).forEach(q => { q.exe(ctx); });
    };

    function pointerdown(e) {
        switch (mode) {
            case 'draw':
                // Set ply and add to command queue
                const x = (e.x - view.x) / view.scl;
                const y = (e.y - view.y) / view.scl;
                ply = {
                    pts: [{ x, y }], lw: '2', ls: '#fff', lc: 'round', lj: 'round',
                    // White shadow to see this on black background
                    get sh() { return this.state & g2.OVER ? [0, 0, 5, plyShadow] : false; },
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

    function tick() {
        let { type, x, y, dx, dy } = interactor.evt;
        switch (mode) {
            case 'draw':
                if (type === 'pan' && ply) {
                    x = (x - view.x) / view.scl;
                    y = (y - view.y) / view.scl;

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
import React from 'react';

export default function DeepmechDraw({ mec2, classes, state }) {
    function mec2Draw(ctx, mec2, state) {
        const interactor = canvasInteractor.create(ctx, {
            x: mec2.x0, y: mec2.y0, cartesian: mec2.cartesian
        });
        canvasInteractor.add(interactor);

        const effects = [
            ['tick', drawTick],
            ['pointerdown', pointerdown],
            ['pointerup', pointerup],
            ['click', pointerup],
        ];
        effects.forEach(e => interactor.on(...e));

        const view = mec2._interactor.view;
        const img_placeholder = g2();
        // Copy only nodes and constraints to command queue
        const mec_placeholder = g2().view(view).use({
            grp: () => ({
                commands: mec2._g.commands.filter(c =>
                    mec2._model.nodes.includes(c.a) ||
                    mec2._model.constraints.includes(c.a))
            })
        });
        const ply_placeholder = g2();

        // A reference to the polyline which is drawn at the moment
        let ply;
        // placeholder for theming later on?
        let plyShadow = "white";

        function pointerdown(e) {
            if (state.draw) {
                // Set ply and add to command queue
                const x = (e.x - view.x) / view.scl;
                const y = (e.y - view.y) / view.scl;
                ply = {
                    pts: [{ x, y }], lw: '2', ls: '#fff', lc: 'round', lj: 'round',
                    // White shadow to see this on black background
                    get sh() { return this.state & g2.OVER ? [0, 0, 5, plyShadow] : false; },
                };
                ply_placeholder.ply(ply);
            }

            if (state.delete) {
                // Filter selected node from commands array
                ply_placeholder.commands = ply_placeholder.commands.filter(
                    cmd => cmd.a !== mec2._selector.selection);
                mec2._selector.evt.hit = false; // selector gets confused
                mec2._selector.selection = false; // overwrite selection
            }
        }

        function pointerup() {
            // If pts is a point => remove ply
            if (ply.pts.length <= 1) {
                ply_placeholder.del(ply_placeholder.commands.length - 1);
            }
            // Reset ply
            ply = undefined;
        }

        function drawTick() {
            let { type, x, y } = interactor.evt;

            if (state.draw && type === 'pan' && ply) {
                x = (x - view.x) / view.scl;
                y = (y - view.y) / view.scl;

                // Omit very small changes
                const tolerance = 0.1;
                const last = ply.pts[ply.pts.length - 1];
                if (Math.hypot(x - last.x, y - last.y) > tolerance) {
                    ply.pts.push({ x, y });
                }
            }
            else if (state.delete || state.drag) {
                ply_placeholder.exe(mec2._selector);
            }

            ply_placeholder.exe(ctx);
        }

        mec_placeholder.exe(ctx);

        return () => {
            canvasInteractor.remove(interactor);
        };
    }

    const canvasRef = React.useRef(null);

    React.useEffect(() => {
        const ctx = canvasRef.current.getContext('2d');
        return mec2Draw(ctx, mec2, state);
    }, []);

    return <canvas
        className={classes.drawCanvas}
        width={globalThis.innerWidth} height={globalThis.innerHeight}
        ref={canvasRef} />
}
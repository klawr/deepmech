import React from 'react';
import { mec2Draw } from '.';

export default function DeepmechDraw({ mec2, classes, state }) {
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
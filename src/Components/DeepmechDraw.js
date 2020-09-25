import React from 'react';
import clsx from 'clsx';

export default function DeepmechDraw({classes, state}) {
    return <canvas
        className={classes.drawCanvas}
        width={globalThis.innerWidth} height={globalThis.innerHeight} />
}
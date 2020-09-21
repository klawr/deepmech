import React from 'react';
import clsx from 'clsx';

export default function DeepmechDraw({classes, state}) {
    return <canvas
        className={clsx(classes.drawCanvas, !state.drawing && classes.hide)} />
}
import React from 'react';
import clsx from 'clsx';

export default function DeepmechDraw(props) {
    return <canvas
        className={clsx(props.classes.drawCanvas,
            !props.state.drawing &&
             props.classes.hide)} />
}
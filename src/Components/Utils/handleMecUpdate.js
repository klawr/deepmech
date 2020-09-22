import React from 'react';

export default function handleMecUpdate(mec2, ref, prop, fn) {
    const [val, changeVal] = React.useState(ref[prop]);
    function handleChange(targetValue) {
        changeVal(targetValue);
        ref[prop] = targetValue;
        if (fn) fn(targetValue);
        mec2._model.reset();
        mec2.render();
    };

    return [val, handleChange];
}
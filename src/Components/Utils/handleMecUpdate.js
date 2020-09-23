import React from 'react';

export default function handleMecUpdate(mec2, elm, prop, updateModel, fn) {
    const [value, changeValue] = React.useState(elm[prop]);
    function handleChange(targetValue) {
        changeValue(targetValue);
        elm[prop] = targetValue;
        if (fn) fn(targetValue);
        updateModel(JSON.parse(mec2._model.asJSON()));
        mec2._model.reset();
        mec2.render();
    };

    return [value, handleChange];
}
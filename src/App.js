import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { DeepmechUI } from './Components';
import { store } from './Features';

let selected = 0;
function handleMecModelUpdate() {
    const m = store.getState().MecModel;
    const q = m.queue;
    const s = m.selected;
    // selected is guaranteed to change on every action
    if (selected === s) return
    // if selected < s, the last action was an update, otherwise it was an undo
    const a = selected < s ? q[s - 1] : q[s];
    mecElement._model[a.list][a.idx][a.property]
        = selected < s ? a.value : a.previous;
    mecElement._model.preview();
    mecElement._model.pose();
    mecElement.render();

    selected = s;
}

store.subscribe(handleMecModelUpdate);

ReactDOM.render(
    <Provider store={store}>
        <DeepmechUI mec2={mecElement} />
    </Provider>,
    document.getElementById('deepmech_nav'));
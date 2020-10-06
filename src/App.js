import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { DeepmechUI } from './Components';
import { store } from './Features';

let selected = 0;
function handleMecModelUpdate() {
    const m = store.getState().MecModel;
    const s = m.selected;
    // selected is guaranteed to change on every action
    if (selected === s) return
    // if selected < s, the last action was an update, otherwise it was an undo
    const a = selected < s ? m.queue[s - 1] : m.queue[s];
    const model = mecElement._model;
    model[a.list][a.idx][a.property]
        = selected < s ? a.value : a.previous;
    // TODO this should be done in mecElement
    model.constraints = model.constraints.map(c => {
        c.p1 = typeof c.p1 === 'object' ? c.p1 : model.nodeById(c.p1);
        c.p2 = typeof c.p2 === 'object' ? c.p2 : model.nodeById(c.p2);
        return c;
    });
    model.views = model.views.map(v => {
        v.of = typeof v.of === 'object' ? v.of : model.nodeById(v.of);
        return v;
    });
    model.preview();
    model.pose();
    mecElement.render();

    selected = s;
}

store.subscribe(handleMecModelUpdate);

ReactDOM.render(
    <Provider store={store}>
        <DeepmechUI mec2={mecElement} />
    </Provider>,
    document.getElementById('deepmech_nav'));
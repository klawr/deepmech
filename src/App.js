import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { DeepmechUI } from './Components';
import { store } from './Features';

let lastMecModelAction;
function handleMecModelUpdate() {
    const q = store.getState().MecModel.queue;
    const a = q[q.length - 1];
    if (lastMecModelAction === a || !q[0]) {
        return;
    }
    mecElement._model[a.list][a.idx][a.property] = a.value;
    mecElement._model.preview();
    mecElement._model.pose();
    mecElement.render();

    lastMecModelAction = a;
}

store.subscribe(handleMecModelUpdate);

ReactDOM.render(
    <Provider store={store}>
        <DeepmechUI mec2={mecElement} />
    </Provider>,
    document.getElementById('deepmech_nav'));
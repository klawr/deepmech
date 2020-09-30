import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { DeepmechUI } from './Components';
import { store } from './Features';

ReactDOM.render(
    <Provider store={store}>
        <DeepmechUI mec2={mecElement} />
    </Provider>,
    document.getElementById('deepmech_nav'));
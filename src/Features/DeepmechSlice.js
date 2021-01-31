import { createSlice } from '@reduxjs/toolkit';
import { deepmech } from '../deepmech';

function tryChromeMessage(message) {
    if (!globalThis?.chrome?.webview) return;

    globalThis.chrome.webview.postMessage(
        JSON.stringify(message));
}

const slice = createSlice({
    name: 'Deepmech',
    initialState: {
        active: false,
        mode: 'draw',
        canvas: undefined,
        extern: {
            initiated: false,
            prediction: false,
            canvas: false,
        }
    },
    reducers: {
        initiate: (state) => {
            if (state.extern.initiated) return;
            tryChromeMessage({ready: "true"});
            state.extern.initiated = true;
        },
        register: (state, action) => {
            console.log(action.payload);
            state.webViewPrediction = action.payload;

            if (!action.payload) {
                globalThis.webviewEventListenerPlaceholder = undefined;
                return;
            }

            if (globalThis.chrome?.webview) {
                if (action.payload.canvas) {
                    state.extern.canvas = true;
                }
                if (action.payload.prediction) {
                    state.extern.prediction = true;
                }
            }
        },
        active: (state, action) => {
            if (!state.extern.canvas) {
                state.active = action.payload;
                return;
            }
            tryChromeMessage({ canvas: action.payload });
        },
        changeMode: (state, action) => {
            state.mode = action.payload;
        },
        updateCanvas: (state, action) => {
            if (!state.extern.canvas) {
                state.canvas = action.payload;
                return;
            }
            tryChromeMessage({ canvas: true });
        },
        updateModel: (state, action) => {
            deepmech.updateNodes(action.payload.nodes);
            deepmech.updateConstraints(action.payload.constraints);

            mecElement._model.draw(mecElement._g);
        },
        // This function is only called if externCanvas is false.
        // TODO Implement eventHandler if base64 comes from webview to predict here.
        predict: (state, action) => {
            const canvas = document.getElementById(state.canvas);
            if (!state.extern.prediction) {
                deepmech.predict(canvas);
                return;
            }
            tryChromeMessage({ image: canvas.toDataURL().replace(/^data:image.+;base64,/, '') });
        },
    },
});

export const deepmechAction = slice.actions;
export const deepmechSelect = state => state.Deepmech;

export default slice.reducer;

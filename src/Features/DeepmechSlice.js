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
        externPrediction: false,
        externCanvas: false,
    },
    reducers: {
        register: (state, action) => {
            state.webViewPrediction = action.payload;

            if (action.payload === false) {
                globalThis.webviewEventListenerPlaceholder = undefined;
                return;
            }

            if (globalThis.chrome?.webview) {
                if (action.payload.canvas) {
                    state.externCanvas = true;
                }
                if (action.payload.prediction) {
                    state.externPrediction = true;
                }
            }
        },
        active: (state, action) => {
            if (!state.externCanvas) {
                state.active = action.payload;
                return;
            }
            tryChromeMessage({ canvas: action.payload });
        },
        changeMode: (state, action) => {
            state.mode = action.payload;
        },
        updateCanvas: (state, action) => {
            if (!state.externCanvas) {
                state.canvas = action.payload;
                return;
            }
            tryChromeMessage({ canvas: true });
        },
        // This function is only called if externCanvas is false.
        // TODO Implement eventHandler if base64 comes from webview to predict here.
        predict: (state, action) => {
            const canvas = document.getElementById(state.canvas);
            if (!state.externPrediction) {
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

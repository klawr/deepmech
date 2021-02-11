import { createSlice } from "@reduxjs/toolkit";
import "../deepmech/NodeModel";
import "../deepmech/ConstraintsModel";

let deepmech;
async function predict(canvas) {
  if (!deepmech) {
    deepmech = (await import("../deepmech/deepmech")).deepmech;
  }
  deepmech.predict(canvas);
}

const ref = globalThis.mecElement;

function tryChromeMessage(message) {
  if (!globalThis?.chrome?.webview) {
    return false;
  }

  globalThis.chrome.webview.postMessage(JSON.stringify(message));

  return true;
}

function tryWebServerMessage(message, port) {
  if (!port) {
    return false;
  }

  fetch("http://localhost:" + port, {
    method: "POST",
    body: JSON.stringify(message),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  }).then((r) => {
    const reader = r.body.getReader();
    // Do something with done?
    reader.read().then(({ done, value }) => {
      updateModel(JSON.parse(String.fromCharCode(...value)));
    });
  });
}

function updateModel(payload) {
  updateNodes(payload.nodes);
  updateConstraints(payload.constraints);

  ref._model.draw(mecElement._g);
}

const slice = createSlice({
  name: "Deepmech",
  initialState: {
    active: false,
    mode: "draw",
    canvas: undefined,
    extern: {
      initiated: false,
      prediction: false,
      canvas: false,
      serverport: 0,
    },
  },
  reducers: {
    initiate: (state) => {
      if (state.extern.initiated) return;
      tryChromeMessage({ ready: true });
      state.extern.initiated = true;
    },
    register: (state, action) => {
      if (!action.payload) {
        globalThis.webviewEventListenerPlaceholder = undefined;
        return;
      }

      if (action.payload.serverport) {
        state.extern.prediction = true;
        state.extern.serverport = action.payload.serverport;
      } else if (globalThis.chrome?.webview) {
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
      updateModel(action.payload);
    },
    // This function is only called if externCanvas is false.
    // TODO Implement eventHandler if base64 comes from webview to predict here.
    predict: (state) => {
      const canvas = document.getElementById(state.canvas);
      if (!state.extern.prediction) {
        predict(canvas);
        return;
      }
      // nodes are submitted as a list of coordiantes [n1.x, n1.y, n2.x ...];
      // The coordinates have to be changed accordingly
      const view = ref._interactor.view;
      const height = ref.height;
      const nodes = ref._model.nodes.map((n) => ({
        id: n.id,
        x: n.x + view.x - 16,
        y: height - n.y - view.y - 16,
      }));
      const message = {
        image: canvas.toDataURL().replace(/^data:image.+;base64,/, ""),
        nodes: JSON.stringify(nodes),
      };
      if (tryChromeMessage(message)) return;
      if (tryWebServerMessage(message, state.extern.serverport)) return;
    },
  },
});

export const deepmechAction = slice.actions;
export const deepmechSelect = (state) => state.Deepmech;

export default slice.reducer;

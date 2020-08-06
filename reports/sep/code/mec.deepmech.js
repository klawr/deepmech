
/**
 * mec.deepmech (c) 2020 Kai Lawrence
 * @requires mec.core.js
 * @requires mec.node.js
 * @requires mec.constraint.js
 * @requires mec.model.js
 * @requires g2.js
 * @requires tensorflow.js
 */

"use strict";
/**
 * Wrapper class to grant access to deepmech functionality
 * @method
 * @param {object} - plain javascript deepmech object.
 */

mec.deepmech = {
    extend(deepmech) {
        deepmech.constructor();
        Object.setPrototypeOf(deepmech, mec.deepmech);
        return deepmech;
    }
}

/**
 * Transform a network into a fully convolutional network.
 * @method
 * @param {object} - A tenfsorflow.js LayersModel
 */
mec.deepmech.toFullyConv = (model) => {
    const newModel = tf.sequential();
    newModel.add(tf.layers.inputLayer({
        inputShape: [null, null, 1]
    }));
    let flattenedInput = false;
    let fDim;

    for (const layer of model.layers) {
        if (layer.name.includes('flatten')) {
            flattenedInput = true;
            fDim = layer.input.shape;
        }

        else if (layer.name.includes('dense')) {
            const inputShape = layer.input.shape;
            const outputDim = layer.getWeights()[1].shape[0];
            const [W, b] = layer.getWeights();

            if (flattenedInput) {
                const shape = [fDim[1], fDim[2], fDim[3], outputDim];
                const newW = W.reshape(shape);
                newModel.add(tf.layers.conv2d({
                    filters: outputDim,
                    kernelSize: [fDim[1], fDim[2]],
                    name: layer.name,
                    strides: [1, 1],
                    activation: layer.activation,
                    padding: 'valid',
                    weights: [newW, b]
                }));
                flattenedInput = false;
            }
            else {
                const shape = [1, 1, inputShape[1], outputDim];
                const newW = W.reshape(shape);
                newModel.add(tf.layers.conv2d({
                    filters: outputDim,
                    kernelSize: [1, 1],
                    strides: [1, 1],
                    activation: layer.activation,
                    padding: 'valid',
                    weights: [newW, b]
                }))
            }
        }

        else {
            newModel.add(layer);
        }
    }
    newModel.layers[1].strides = [1, 1]
    return newModel;
}

mec.deepmech.detector = {
    nodeDetector: (async () => mec.deepmech.toFullyConv(
        await tf.loadLayersModel(new NodeModel())))(),

    constraintDetector: (async () => {
        return await tf.loadLayersModel(new ConstraintModel());
    })(),

    /**
     * Add handwritten nodes to mec.
     * @param {object} image (tensor) which contains the image on the canvas. 
     * @returns {object} predicted nodes of the model.
     */
    async detectNodes(image) {
        function extractInterestingInfo(pred, idx) {
            const y = idx * 4;
            return pred.flatMap((inner, i) => {
                const max = Math.max(...inner);
                const maxIndex = inner.indexOf(max);
                const x = i * 4;
                return { x, y, max, maxIndex, b: 32, h: 32 }
            });
        }
        function removeOverlaps(boxes) {
            const mostAccurate = [];
            while (boxes.length) {
                const max = boxes.pop();
                mostAccurate.push(max);
                boxes = boxes.filter(rec =>
                    Math.abs(rec.x - max.x) >= rec.b ||
                    Math.abs(rec.y - max.y) >= rec.h);
            }
            return mostAccurate;
        }

        const nodeDetector = await this.nodeDetector;
        const prediction = nodeDetector.predict(image, { batch_size: 1 }).arraySync()[0];
        const nodes = removeOverlaps(prediction
            .flatMap(extractInterestingInfo)
            .filter(e => e.maxIndex).sort((a, b) => a.max - b.max));

        return nodes;
    },

    /**
     * @param {object} image (tensor) which contains the image on the canvas. 
     * @param {object} element element to predict.
     *  TODO this should be removed, but is necessary for the moment because of element height and view...
     *       have to find a way around this.
     * @param {object} nodes mec2 nodes
     * @param {object} constraint mec2 constraints
     * @returns {array} [crops, info]
     *  crops to detect constraints and info array which contains info about
     *  the mirroring of the respective image (to keep y1, x1, y2, x2 aligned)
     *  and which nodes 
     */
    getCrops(image, element, nodes, constraints = []) {
        const view = element._interactor.view;

        const info = [];
        const boxes = nodes.flatMap(node1 => {
            return nodes.map(node2 => {
                // Return if these nodes already have a mutual constraint
                if (constraints.find(c =>
                    c.p1 == node1.id && c.p2 == node2.id ||
                    c.p1 == node2.id && c.p2 == node1.id
                )) { return; }

                // y1, y2 are reversed because of cartesian
                let y1 = Math.max(node1.y, node2.y);
                let x1 = Math.min(node1.x, node2.x);
                let y2 = Math.min(node1.y, node2.y);
                let x2 = Math.max(node1.x, node2.x);

                // Return if the resulting crop would be 1 dimensional.
                if (x1 === x2 || y1 === y2) return;

                let o = {
                    mirror: 0, p1: node1.id, p2: node2.id,
                    x1: node1.x, y1: node1.y, x2: node2.x, y2: node2.y
                };
                // Flip vertically if x2 is the second node
                // NOTE which seems to be the wrong way around...
                if (x2 == node1.x) o.mirror++;
                // Flip horizontally if y2 is the second node
                // NOTE which seems to be okay...
                if (y2 == node1.y) o.mirror += 2;
                info.push(o);

                // Apply cartesian and viewport alterations
                [y1, y2] = [y1, y2].map(y => element.height - (y * view.scl + view.y));
                [x1, x2] = [x1, x2].map(x => x * view.scl + view.x);

                // Put coordinates in [0, 1] range
                [y1, y2] = [y1, y2].map(y => y / element.height);
                [x1, x2] = [x1, x2].map(x => x / element.width);

                return [y1, x1, y2, x2];
            });
        }).filter(e => e); // Remove the "short circuits"
        if (!boxes.length) return [];

        const boxInd = new Array(boxes.length).fill(0);
        let blob = tf.image.cropAndResize(image, boxes, boxInd, [96, 96]);

        blob = blob.arraySync().map(((b, idx) => {
            b = tf.squeeze(b);

            if (info[idx].mirror == 1)
                return tf.reverse2d(b, 1)
            else if (info[idx].mirror == 2)
                return tf.reverse2d(b, 0)
            else if (info[idx].mirror == 3)
                return tf.reverse2d(b)
            else
                return b;
        }));

        blob = tf.stack(blob);
        blob = blob.expandDims(-1);

        return [blob, info];
    },

    /**
     * Detect constraints on prepared crops.
     * @param {object} image (tensor) which contains the image on the canvas.
     * @returns {object} Predicted constraints on crops.
     *                   Constraints are only predicted if they point from upper left to bottom right
     */
    async detectConstraints(crops) {
        const constraintDetector = await this.constraintDetector;
        return constraintDetector.predict(crops, { batch_size: crops.shape[0] })
            .arraySync()
            .map(c => c.indexOf(Math.max(...c)));
    }
}

/**
 * Predict nodes on image and draw them on canvas of mec2 element
 * @param {object} mec2Element
 */
mec.deepmech.predict = async (element) => {
    const model = element._model;

    let tensor = tf.browser.fromPixels(this.mecElement._ctx.canvas, 1);
    tensor = tensor.div(255).expandDims();

    const nodes = await mec.deepmech.detector.detectNodes(tensor);

    const view = element._interactor.view;
    nodes.forEach(e => {
        const node = {
            id: 'node' + model.nodes.length, // TODO Think of a better id here.
            x: Math.round((e.x - view.x + 16) / view.scl),
            y: Math.round((element.height - e.y - view.y - 16) / view.scl),
            base: e.maxIndex > 1 ? true : false // 0 == n, 1 == o, 2 == x (0 is filtered...)
        };
        mec.node.extend(node);
        model.addNode(node);
        node.init(model);
    });

    const [crops, info] = mec.deepmech.detector.getCrops(tensor, element, model.nodes, model.constraints);
    if (crops) {
        const constraints = await mec.deepmech.detector.detectConstraints(crops);

        constraints.forEach((c, idx) => {
            if (!c) return;
            const p1 = info[idx].p1;
            const p2 = info[idx].p2;
            if (!p1 || !p2) {
                console.warn('Found no matching nodes for consraitns:', p1, p2, model.nodes);
            } else {
                const constraint = {
                    id: 'constraint' + model.constraints.length, // TODO Think of a better id here.
                    p1, p2,
                    len: { type: c == 1 ? 'const' : 'free' },
                    ori: { type: c == 2 ? 'const' : 'free' }
                };
                mec.constraint.extend(constraint);
                model.addConstraint(constraint);
                constraint.init(model);
            }
        })
    }
    element._model.draw(element._g);
}

// Apply deepmech to a Mec2Element
mec.deepmech.apply = (element) => {
    // Copy corview to have coordinates in draw mode (appendChild actually moves the Node...)
    const view = element._interactor.view;
    // A placeholder to insert uploaded images
    const img_placeholder = g2();
    // A placeholder for the current mec
    const mec_placeholder = g2();
    // A placeholder for upcomming drawn lines
    const ply_placeholder = g2();

    const command_queue = g2()
        .rec({
            x: () => -view.x / view.scl,
            y: () => -view.y / view.scl,
            b: () => element.width / view.scl + 1,
            h: () => element.height / view.scl + 1,
            fs: '#000',
            isSolid: false
        }) // should not be detected by selector
        .view(view) // Same view as the original model
        .use({ grp: () => img_placeholder })
        .use({ grp: () => mec_placeholder })
        .use({ grp: () => ply_placeholder });

    // A reference to the "polyline" which is drawn at the moment
    let ply;
    // Mode to keep trach of current action
    let mode;

    // placeholder for theming later on?
    let plyShadow = "white";

    function buttonFactory(str, fn) {
        const btn = document.createElement('span');
        btn.style.paddingLeft = '10px';
        btn.innerHTML = str;
        btn.id = str + 'btn';
        btn.addEventListener('click', fn, false);
        return btn;
    }

    function swapNodes(a, b) {
        const aParent = a.parentNode;
        const bParent = b.parentNode;

        const aHolder = document.createElement("div");
        const bHolder = document.createElement("div");

        aParent.replaceChild(aHolder, a);
        bParent.replaceChild(bHolder, b);

        aParent.replaceChild(b, aHolder);
        bParent.replaceChild(a, bHolder);
    }

    function drawTick() {
        let { type, x, y } = element._interactor.evt;
        // Keep the pointer coordinates updated
        element._corview.innerHTML = x.toFixed(0) + ', ' + y.toFixed(0);

        // "ply" is only defined between "pointerdown" and "pointerup"/"click" in draw mode
        if (mode === "draw" && type === 'pointermove' && ply) {
            x = (x - view.x) / view.scl;
            y = (y - view.y) / view.scl;

            // Omit very small changes
            const last = ply.pts[ply.pts.length - 1];
            if (Math.hypot(x - last.x, y - last.y) > 0.1) {
                ply.pts.push({ x, y });
            }
        }
        else if (mode === "delete" || mode === "drag") {
            ply_placeholder.exe(element._selector);
        }
        command_queue.exe(element._ctx);
    }

    function uploadImage() {
        const _input = document.createElement('input');
        _input.accept = "image";
        _input.type = "file";
        _input.click();
        const reader = new window.FileReader();
        _input.addEventListener('input', () => {
            reader.readAsDataURL(_input.files[0]);
        });

        reader.addEventListener('loadend', () => {
            // Inject image into command queue (after "view" and "rec")
            const x = -view.x / view.scl;
            const y = -view.y / view.scl;
            const scl = 1 / view.scl;
            img_placeholder.img({ uri: reader.result, x, y, scl });
        });
    }

    function resetDrawMode() {
        mode = undefined;
        plyShadow = "white";
        element._g.exe(element._selector);

        element._interactor.remove('pointerdown', pointerdown);
        element._interactor.remove('pointerup', pointerup);
        element._interactor.remove('click', pointerup);
        for (const node of navRightDraw.childNodes) {
            if (node.tagName !== 'SPAN') continue
            node.style.color = '';
        }
    }

    function deleteFn() {
        resetDrawMode();
        mode = 'delete';
        plyShadow = "red";
        deleteBtn.style.color = '#fff';
        element._interactor.on('pointerdown', pointerdown)
        element._interactor.pointermove = fetch_pointermove;
    }

    function dragFn() {
        resetDrawMode();
        mode = 'drag';
        dragBtn.style.color = '#fff';
        element._interactor.pointermove = fetch_pointermove;
    }

    function drawFn() {
        resetDrawMode();
        mode = 'draw';
        drawBtn.style.color = '#fff';
        // Remove "ontick" in drawing mode and "panning" of view while drawing
        element._interactor.remove('tick', fetch_tick);
        // Prevent pointermove "panning" but still cache the event for mouse position:
        element._interactor.pointermove = () => undefined;

        element._interactor.on('pointerdown', pointerdown)
        element._interactor.on(['pointerup', 'click'], pointerup);
    }

    function activateDrawMode(e) {
        nav.replaceChild(navLeftDraw, navLeft);
        nav.replaceChild(navRightDraw, navRight);

        swapNodes(logo, logoDrawPlaceholder);
        swapNodes(element._corview, corviewPlaceholder);
        // draw mode is default
        drawBtn.style.color = '#fff';
        drawFn();

        element._interactor.on('tick', drawTick);

        // Filter all "nodes" and "constraint" commands from _g command queue
        const filtered_mec = {
            commands: element._g.commands.filter(c =>
                element._model.nodes.includes(c.a) ||
                element._model.constraints.includes(c.a))
        };
        mec_placeholder.use({ grp: () => filtered_mec });
        command_queue.exe(element._ctx);
    }

    // Revert previous changes
    function deactivateDrawMode(e) {
        resetDrawMode();
        nav.replaceChild(navLeft, navLeftDraw);
        nav.replaceChild(navRight, navRightDraw);

        swapNodes(logo, logoDrawPlaceholder);
        swapNodes(element._corview, corviewPlaceholder);

        element._interactor.remove('tick', drawTick);
        element._interactor.on('tick', fetch_tick);
        element._interactor.pointermove = fetch_pointermove;

        // Reset placeholders
        img_placeholder.commands = [];
        mec_placeholder.commands = [];
        ply_placeholder.commands = [];
        element._g.exe(element._ctx);
    }

    function pointerdown(e) {
        if (mode === "draw") {
            // Set ply and add to command queue
            const x = (e.x - view.x) / view.scl;
            const y = (e.y - view.y) / view.scl;
            ply = {
                pts: [{ x, y }], lw: '2', ls: '#fff', lc: 'round', lj: 'round',
                // White shadow to see this on black background
                get sh() { return this.state & g2.OVER ? [0, 0, 5, plyShadow] : false; },
            };
            ply_placeholder.ply(ply);
        }

        if (mode === "delete") {
            // Filter selected node from commands array
            ply_placeholder.commands = ply_placeholder.commands.filter(
                cmd => cmd.a !== element._selector.selection);
            element._selector.evt.hit = false; // selector gets confused
            element._selector.selection = false; // overwrite selection
        }
    }

    function pointerup() {
        // If pts is a point => remove ply
        if (ply.pts.length < 2) {
            ply_placeholder.del(ply_placeholder.commands.length - 1);
        }
        // Reset ply
        ply = undefined;
    }

    // Get functions which were given to element._interactor.on
    // NOTE This assumes that the respective signal is added first!
    const fetch_tick = element._interactor.signals['tick'][0];
    const fetch_pointermove = element._interactor.pointermove;

    const nav = element._root.children[1].children[0];
    const navLeft = nav.children[0];
    const activateDrawBtn = buttonFactory('d', activateDrawMode);
    activateDrawBtn.innerHTML = '🖊️';
    activateDrawBtn.style.paddingLeft = '5px';
    const navRight = nav.children[1];
    const logo = navLeft.children[0];

    const navLeftDraw = document.createElement('span');
    const logoDrawPlaceholder = document.createElement('div');
    const deactivateDrawBtn = buttonFactory('reset', deactivateDrawMode);
    const uploadImageBtn = buttonFactory('upload', uploadImage);

    const navRightDraw = document.createElement('span');
    const corviewPlaceholder = document.createElement('div');

    const drawBtn = buttonFactory('draw', drawFn);
    const dragBtn = buttonFactory('drag', dragFn);
    const deleteBtn = buttonFactory('del', deleteFn);
    const predictBtn = buttonFactory('predict', () => {
        mec.deepmech.predict(element);
        deactivateDrawMode();
    });

    navLeft.appendChild(activateDrawBtn);

    navLeftDraw.appendChild(logoDrawPlaceholder);
    navLeftDraw.appendChild(uploadImageBtn);
    navLeftDraw.appendChild(deactivateDrawBtn);

    navRightDraw.appendChild(corviewPlaceholder);
    navRightDraw.appendChild(drawBtn);
    navRightDraw.appendChild(dragBtn);
    navRightDraw.appendChild(deleteBtn);
    navRightDraw.appendChild(predictBtn);
}

// TODO this is unacceptable... Hook into constructor somehow.

mec.deepmech.activate = {
    _: (() => {
        for (const element of document.getElementsByTagName('mec-2')) {
            mec.deepmech.apply(element);
        }
    })()
}
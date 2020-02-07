const mec2Elements = document.getElementsByTagName('mec-2');
function mec2Deepmech() {
    // Helper to switch nodes
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
    // Helper to create buttons
    function buttonFactory(str, fn) {
        const btn = document.createElement('span');
        btn.style.paddingLeft = '10px';
        btn.innerHTML = str;
        btn.id = str + 'btn';
        btn.addEventListener('click', fn, false);
        return btn;
    }
    for (element of mec2Elements) {
        // Each element gets a deepmech object, which handles the predictions
        const deepmech = {
            mecElement: element,
            logging: true,
            loader: new Loader(),
            crop: new Crop(),
            get symbolClassifier() { return tf.loadLayersModel(this.loader) },
            get cropIdentifier() { return tf.loadLayersModel(this.crop) },

            /**
             * Add handwritten nodes to mec
             * @param {object} image (tensor) which contains the image on the canvas. 
             * @param {object} nodeDetector model which detects nodes.
             */
            detectNodes(image, nodeDetector, model, logging) {
                logging && console.log('Beginning first scan: ', performance.now() - this.t0);
                const prediction = nodeDetector.predict(image, { batch_size: 1 }).arraySync()[0];
                logging && console.log('First prediction finished: ', performance.now() - this.t0);

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
                const nodes = removeOverlaps(prediction
                    .flatMap(extractInterestingInfo)
                    .filter(e => e.maxIndex).sort((a, b) => a.max - b.max));

                nodes.forEach(e => {
                    const node = {
                        id: 'node' + model.nodes.length,
                        x: Math.round(e.x - this.mecElement._interactor.view.x + 16),
                        y: Math.round(this.mecElement.height - e.y - this.mecElement._interactor.view.y - 16),
                        base: e.maxIndex > 1 ? true : false // 0 == n, 1 == o, 2 == x (0 is filtered...)
                    };
                    mec.node.extend(node);
                    model.addNode(node);
                    node.init(model);
                });
                logging && console.log('Detected ', nodes.length, 'nodes: ', performance.now() - this.t0);
            },

            /**
             * @param {object} model mechanism to create boxes from which are later investigated.
             * @returns {array} [crops, info]
             *  crops to detect constraints and info array which contains info about
             *  the mirroring of the respective image (to keep y1, x1, y2, x2 aligned)
             *  and which nodes 
             */
            getCrops(image, model, logging) {
                const view = this.mecElement._interactor.view;

                const info = [];
                const boxes = model.nodes.flatMap(node1 => {
                    return model.nodes.map(node2 => {
                        // Return if these nodes already have a mutual constraint
                        if (model.constraints.find(c =>
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

                        let o = { mirror: 0, p1: node1.id, p2: node2.id };
                        // Flip vertically if x2 is the second node
                        // NOTE which seems to be the wrong way around...
                        if (x2 == node1.x) o.mirror++;
                        // Flip horizontally if y2 is the second node
                        // NOTE which seems to be okay...
                        if (y2 == node1.y) o.mirror += 2;
                        info.push(o);

                        // Apply cartesian and viewport alterations
                        [y1, y2] = [y1, y2].map(y => this.mecElement.height - (y * view.scl + view.y));
                        [x1, x2] = [x1, x2].map(x => x * view.scl + view.x);

                        // Put coordinates in [0, 1] range
                        [y1, y2] = [y1, y2].map(y => y / this.mecElement.height);
                        [x1, x2] = [x1, x2].map(x => x / this.mecElement.width);

                        return [y1, x1, y2, x2];
                    });
                }).filter(e => e); // Remove the "short circuits"
                if (!boxes.length) return [];

                const boxInd = new Array(boxes.length).fill(0);
                blob = tf.image.cropAndResize(image, boxes, boxInd, [96, 96]);

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
             * @param {object} crops - a tensor containing constraint candidates 
             * @param {array} mirror - contains information about the mirroring of the tensor
             * @param {object} constraintDetector - model to detect constraints 
             */
            detectConstraints(crops, info, constraintDetector, model, logging) {
                logging && console.log('Beginning second scan: ', performance.now() - this.t0);
                let constraints = constraintDetector.predict(crops, { batch_size: crops.shape[0] }).arraySync();
                logging && console.log('Second prediction finished: ', performance.now() - this.t0);

                constraints = constraints.map(c => c.indexOf(Math.max(...c)));
                let num = 0;
                constraints.forEach((c, idx) => {
                    if (!c) return;
                    num++;
                    const p1 = info[idx].p1;
                    const p2 = info[idx].p2;
                    if (!p1 || !p2) {
                        console.warn('Found no matching nodes for constraint:', p1, p2, model.nodes);
                    } else {
                        const constraint = {
                            id: 'constraint' + model.constraints.length,
                            p1, p2,
                            len: { type: c == 1 ? 'const' : 'free' },
                            ori: { type: c == 2 ? 'const' : 'free' }
                        };
                        mec.constraint.extend(constraint);
                        model.addConstraint(constraint);
                        constraint.init(model);
                    }
                });
                logging && console.log('Found ', num, 'new constraints: ', performance.now() - this.t0);
            },

            async load() {
                const model = this.mecElement._model;
                this.t0 = performance.now();
                console.log('Starting...');
                let tensor = tf.browser.fromPixels(this.mecElement._ctx.canvas, 1);
                tensor = tensor.div(255);
                tensor = tensor.expandDims();
                const nodeDetector = toFullyConv(await this.symbolClassifier);
                this.detectNodes(tensor, nodeDetector, model, this.logging);

                const [crops, info] = this.getCrops(tensor, model, this.logging);
                if (crops) {
                    const constraintDetector = await this.cropIdentifier;
                    this.detectConstraints(crops, info, constraintDetector, model, this.logging);
                }
                this.mecElement._model.draw(this.mecElement._g);
                console.log('finished after: ', performance.now() - this.t0)
            }
        }

        // Copy corview to have coordinates in draw mode (appendChild actually moves the Node...)
        const view = element._interactor.view;
        const _g_draw = g2()
            // Background for drawing (and applies a "clr"...)
            .rec({
                x: () => -view.x / view.scl,
                y: () => -view.y / view.scl,
                b: () => element.width / view.scl + 1,
                h: () => element.height / view.scl + 1,
                fs: '#000',
                isSolid: false // should not be detected by selector
            })
            .view(view); // Same view as the original model

        let ply = undefined; // A reference to the "polyline" which is drawn at the moment

        let mode; // Mode to keep track of current action
        const tick = () => {
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
                _g_draw.exe(element._selector);
            }
            _g_draw.exe(element._ctx);
        }
        let plyShadow = "white";
        const pointerdown = (e) => {
            if (mode === "draw") {
                // Set ply and add to command queue
                const x = (e.x - view.x) / view.scl;
                const y = (e.y - view.y) / view.scl;
                ply = {
                    pts: [{ x, y }], lw: '2', ls: '#fff', lc: 'round', lj: 'round',
                    // White shadow to see this on black background
                    get sh() { return this.state & g2.OVER ? [0, 0, 5, plyShadow] : false; },
                };
                _g_draw.ply(ply);
            }
            if (mode === "delete") {
                // Filter selected node from commands array
                _g_draw.commands = _g_draw.commands.filter(cmd =>
                    cmd.a !== element._selector.selection);
                element._selector.evt.hit = false; // selector gets confused
                element._selector.selection = false; // overwrite selection
            }
        }
        const pointerup = () => {
            // If pts is a point => remove ply
            if (ply.pts.length < 2) _g_draw.del(_g_draw.commands.length - 1);
            // Reset ply
            ply = undefined;
        }

        // Get functions which were given to element._interactor.on
        // NOTE This assumes that the respective signal is added first!
        const fetch_tick = element._interactor.signals['tick'][0];
        const fetch_pointermove = element._interactor.pointermove;
        function activate(e) {
            nav.replaceChild(navLeftDraw, navLeft);
            nav.replaceChild(navRightDraw, navRight);

            swapNodes(logo, logoPlaceholder);
            swapNodes(element._corview, corviewPlaceholder);
            // draw mode is default
            drawBtn.style.color = '#fff';
            drawFn();

            element._interactor.on('tick', tick);

            // Filter all "nodes" and "constraint" commands from _g command queue
            const grp = {
                commands: element._g.commands.filter(c =>
                    element._model.nodes.includes(c.a) ||
                    element._model.constraints.includes(c.a))
            };

            _g_draw.use({ grp }).exe(element._ctx);
        }

        function reset() {
            mode = undefined;
            plyShadow = "white";
            element._g.exe(element._selector);

            element._interactor.remove('pointerdown', pointerdown);
            element._interactor.remove('pointerup', pointerup);
            element._interactor.remove('click', pointerup);
            for (node of navRightDraw.childNodes) {
                if (node.tagName !== 'SPAN') continue
                node.style.color = '';
            }
        }

        // Revert previous changes
        function deactivate(e) {
            reset();
            nav.replaceChild(navLeft, navLeftDraw);
            nav.replaceChild(navRight, navRightDraw);

            swapNodes(logo, logoPlaceholder);
            swapNodes(element._corview, corviewPlaceholder);

            element._interactor.remove('tick', tick);
            element._interactor.on('tick', fetch_tick);
            element._interactor.pointermove = fetch_pointermove;

            _g_draw.del(2); // Delete command queue (except "view" and "rec" (background))
            element._g.exe(element._ctx);
        }

        function drawFn() {
            reset();
            mode = 'draw';
            drawBtn.style.color = '#fff';
            // Remove "ontick" in drawing mode and "panning" of view while drawing
            element._interactor.remove('tick', fetch_tick);
            // Prevent pointermove "panning" but still cache the event for mouse position:
            element._interactor.pointermove = () => undefined;

            element._interactor.on('pointerdown', pointerdown)
            element._interactor.on(['pointerup', 'click'], pointerup);
        }

        function dragFn() {
            reset();
            mode = 'drag';
            dragBtn.style.color = '#fff';
            element._interactor.pointermove = fetch_pointermove;
        }

        function deleteFn() {
            reset();
            mode = 'delete';
            plyShadow = "red";
            deleteBtn.style.color = '#fff';
            element._interactor.on('pointerdown', pointerdown)
            element._interactor.pointermove = fetch_pointermove;
        }

        const nav = element._root.children[1].children[0];
        const navLeft = nav.children[0];
        const activateBtn = buttonFactory('d', activate);
        const navRight = nav.children[1];
        const logo = navLeft.children[0];

        const navLeftDraw = document.createElement('span');
        const logoPlaceholder = document.createElement('div');
        const deactivateBtn = buttonFactory('reset', deactivate);

        const navRightDraw = document.createElement('span');
        const corviewPlaceholder = document.createElement('div');

        const drawBtn = buttonFactory('draw', drawFn);
        const dragBtn = buttonFactory('drag', dragFn);
        const deleteBtn = buttonFactory('del', deleteFn);
        const predictBtn = buttonFactory('predict', () => deepmech.load() && deactivate());

        navLeft.appendChild(activateBtn);

        navLeftDraw.appendChild(logoPlaceholder);
        navLeftDraw.appendChild(deactivateBtn);

        navRightDraw.appendChild(corviewPlaceholder);
        navRightDraw.appendChild(drawBtn);
        navRightDraw.appendChild(dragBtn);
        navRightDraw.appendChild(deleteBtn);
        navRightDraw.appendChild(predictBtn);

    }
}
mec2Deepmech();
const mec2Elements = document.getElementsByTagName('mec-2');
function mec2Deepmech() {
    for (element of mec2Elements) {
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
                        y: Math.round(this.mecElement.height -e.y - this.mecElement._interactor.view.y - 16),
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

        const navLeft = element._root.children[1].children[0].children[0];
        const navRight = element._root.children[1].children[0].children[1];
        const navRightDraw = document.createElement('span');

        const predictBtn = document.createElement('span');
        predictBtn.style.paddingLeft = '10px';
        predictBtn.innerHTML = 'predict';
        predictBtn.id = 'predictbtn';
        predictBtn.addEventListener('click', () => {
            deepmech.load();
            toggleDraw();
        }, false);
        navRightDraw.appendChild(predictBtn)

        const c = element._ctx.canvas;
        const view = element._interactor.view;
        const cq = g2();

        function draw(e) {
            if (!drawing) return;

            e.preventDefault();
            const bbox = e.target.getBoundingClientRect && e.target.getBoundingClientRect() || { left: 0, top: 0 };
            const x = (-view.x + e.clientX - Math.floor(bbox.left)) / view.scl;
            const y = (-view.y + element.height - (e.clientY - Math.floor(bbox.top))) / view.scl;
            if (last) {
                const now = { x2: x, y2: y };
                if (e.buttons === 1) {
                    cq.lin({ ...last, ...now, lc: 'round', lw: 3, ls: '#fff' });
                }
                else if (e.buttons === 2) {
                    cq.lin({ ...last, ...now, lc: 'round', lw: 6, ls: '#000' });
                }
            }
            last = { x1: x, y1: y };
            cq.exe(element._ctx);
        }
        function cancel(e) {
            c.removeEventListener('pointermove', draw);
            last = undefined;
        }
        function drawOnMove(e) { c.addEventListener('pointermove', draw); }
        function preventDefault(e) { if (drawing) e.preventDefault(); }

        let last;
        drawing = false;
        function toggleDraw(e) {
            drawing = !drawing;
            if (drawing) {
                navLeft.parentNode.replaceChild(navRightDraw, navRight);

                element._interactor.deinit();
                c.addEventListener('pointerup', cancel);
                c.addEventListener('pointerdown', drawOnMove);
                c.addEventListener('contextmenu', preventDefault);
                const grp = {
                    commands: element._g.commands.filter(c =>
                        element._model.nodes.includes(c.a) ||
                        element._model.constraints.includes(c.a))
                };
                cq.view(view)
                    .rec({
                        x: () => -view.x / view.scl,
                        y: () => -view.y / view.scl,
                        // Just a little overhead to be sure.
                        b: () => element.width * 1.25 / view.scl,
                        h: () => element.height * 1.25 / view.scl,
                        fs: '#000'
                    })
                    .use({ grp })
                    .exe(element._ctx);
            } else {
                navLeft.parentNode.replaceChild(navRight, navRightDraw);

                c.removeEventListener('pointerdown', drawOnMove);
                element._interactor.init(element._ctx);
                element._interactor.startTimer();
                cq.del();

                element._g.exe(element._ctx);
            }
        }

        const drawbtn = document.createElement('span');
        drawbtn.style.paddingLeft = '10px';
        drawbtn.innerHTML = 'draw';
        drawbtn.id = 'drawbtn';
        drawbtn.addEventListener('click', toggleDraw, false);
        navLeft.appendChild(drawbtn)

        element._drawbtn = drawbtn;
    }
}
mec2Deepmech();
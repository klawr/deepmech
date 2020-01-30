const deepmech = {
    mecElement: mecElement,
    logging: false,
    loader: new Loader(),
    crop: new Crop(),
    get symbolClassifier() { return tf.loadLayersModel(this.loader) },
    get cropIdentifier() { return tf.loadLayersModel(this.crop) },

    /**
     * Add handwritten nodes to mec
     * @param {object} image (tensor) which contains the image on the canvas. 
     * @param {object} model model which detects nodes.
     */
    detectNodes(image, model, mec, logging) {
        logging && console.log('Beginning first scan: ', performance.now() - t0);
        const prediction = model.predict(image, { batch_size: 1 }).arraySync()[0];
        logging && console.log('First prediction finished: ', performance.now() - t0);

        function extractInterestingInfo(pred, idx) {
            const y = idx * 4;
            return pred.flatmap((inner, i) => {
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

        if (!mec.nodes) mec.nodes = [];

        nodes.forEach(e => {
            mec.nodes.push({
                id: 'node' + mec.nodes.length,
                x: parseInt(e.x) - this.mecElement._interactor.view.x,
                y: this.mecElement.height - parseInt(e.y) - this.mecElement._interactor.view.y,
                base: e.ls === 'red' ? false : true
            });
        });
        logging && console.log('Detected ', nodes.length, 'nodes: ', performance.now() - t0);
    },

    /**
     * @param {object} mec mechanism to create boxes from which are later investigated.
     * @returns {array} [crops, mirror]
     *  crops to detect constraints and mirror array which contains info about
     *  the mirroring of the respective image (to keep y1, x1, y2, x2 aligned)
     */
    getCrops(image, mec, logging) {
        if (!mec.constraints) mec.constraints = [];
        const view = this.mecElement._interactor.view;
        const h = this.mecElement.height - view.y;

        const mirror = [];
        const boxes = mec.nodes.flatMap(node1 => {
            return mec.nodes.map(node2 => {
                // Return if these nodes already have a mutual constraint
                if (mec.constraints.find(c =>
                    c.p1 == node1.id && c.p2 == node2.id ||
                    c.p1 == node2.id && c.p2 == node1.id
                )) { return; }

                const x1 = Math.min(node1.x, node2.x) - view.x;
                const x2 = Math.max(node1.x, node2.x) - view.x;
                const y2 = h - Math.min(node1.y, node2.y);
                const y1 = h - Math.max(node1.y, node2.y);

                // Return if the resulting crop would be 1 dimensional.
                if (x1 === x2 || y1 === y2) return;

                let m = 0
                // Flip vertically
                if (x2 == node2.x - view.x) m++;
                // Flip horizontally
                if (y2 == h - node2.y) m += 2;
                mirror.push(m);

                return [y1, x1, y2, x2].map(c => (c + 16) / 360)
            });
        }).filter(e => e); // Remove the "short circuits"

        if (!boxes.length) return [];

        const boxInd = new Array(boxes.length).fill(0);
        // TODO make the crop smaller (update model)
        blob = tf.image.cropAndResize(image, boxes, boxInd, [360, 360]);
        blob = blob.arraySync().map(((b, idx) => {
            // TODO try to remove operations here
            logging && console.log('start_:', idx, ': ', performance.now() - t0)
            box = boxes[idx]
            const height = parseInt((box[2] - box[0]) / (box[3] - box[1]) * 360)
            b = tf.image.resizeBilinear(b, [height, 360])
            logging && console.log('resized_1_:', idx, ': ', performance.now() - t0)
            let pad = parseInt((height - 360) / 2);
            pad = pad < 0 ? [[-pad, -pad], [0, 0]] : [[0, 0], [pad, pad]];
            b = tf.squeeze(b)
            b = tf.pad2d(b, pad)
            b = tf.expandDims(b, -1)
            b = tf.image.resizeBilinear(b, [360, 360])
            logging && console.log('resized_2_:', idx, ': ', performance.now() - t0)
            b = tf.squeeze(b);

            if (mirror[idx] == 1)
                return tf.reverse2d(b, 1)
            else if (mirror[idx] == 2)
                return tf.reverse2d(b, 0)
            else if (mirror[idx] == 3)
                return tf.reverse2d(b)
            else
                return b;
        }));

        blob = tf.stack(blob);
        blob = blob.expandDims(-1);
        return [blob, boxes, mirror];
    },

    /**
     * @param {object} crops - a tensor containing constraint candidates 
     * @param {array} mirror - contains information about the mirroring of the tensor
     * @param {object} model - model to detect constraints 
     */
    detectConstraints(crops, boxes, mirror, model, mec, logging) {
        logging && console.log('Beginning second scan: ', performance.now() - t0);
        let constraints = model.predict(crops, { batch_size: crops.shape[0] }).arraySync();
        logging && console.log('Second prediction finished: ', performance.now() - t0);

        let num = 0;
        const view = this.mecElement._interactor.view;
        const h = this.mecElement.height - view.y;

        constraints = constraints.map(c => c.indexOf(Math.max(...c)));
        constraints.forEach((c, idx) => {
            if (!c) return;
            num++;
            let type = ['rot', 'trans'];
            const lin = {
                y1: Math.round(boxes[idx][0] * 360),
                x1: Math.round(boxes[idx][1] * 360),
                y2: Math.round(boxes[idx][2] * 360),
                x2: Math.round(boxes[idx][3] * 360),
                type: type[c]
            }
            if (mirror[idx] === 1 || mirror[idx] === 3) {
                const tmp = lin.x1;
                lin.x1 = lin.x2;
                lin.x2 = tmp;
            }
            if (mirror[idx] === 2 || mirror[idx] === 3) {
                const tmp = lin.y1;
                lin.y1 = lin.y2;
                lin.y2 = tmp;
            }
            let p1 = mec.nodes.find(node =>
                node.x === lin.x1 - 16 && node.y === h - lin.y1 + 16)
            p1 = p1 ? p1.id : undefined
            let p2 = mec.nodes.find(node =>
                node.x === lin.x2 - 16 && node.y === h - lin.y2 + 16)
            p2 = p2 ? p2.id : undefined
            if (!p1 || !p2) {
                console.log('Found no matching nodes for constraint:', lin, mec.nodes);
            }
            else mec.constraints.push({
                id: 'constraint' + idx, p1, p2,
                len: { type: type[c] === 'rot' ? 'const' : 'free' },
                ori: { type: type[c] === 'trans' ? 'free' : 'const' }
            });
        });
        logging && console.log('drew ', num, 'constraints: ', performance.now() - t0);
    },

    async load() {
        const mec = JSON.parse(this.mecElement.innerHTML);
        const t0 = performance.now();
        console.log('Starting...');
        let tensor = tf.browser.fromPixels(this.mecElement._ctx.canvas, 1);
        tensor = tensor.div(255);
        tensor = tensor.expandDims();
        const nodeDetector = toFullyConv(await this.symbolClassifier);
        this.detectNodes(tensor, nodeDetector, mec, this.logging);
        const [crops, boxes, mirror] = this.getCrops(tensor, mec, this.logging);
        if (crops) {
            const constraintsDetector = await this.cropIdentifier;
            this.detectConstraints(crops, boxes, mirror, constraintsDetector, mec, this.logging);
        }
        this.mecElement.innerHTML = JSON.stringify(mec);
        this.mecElement.init();
        mec2Deepmech();
        console.log('finished after: ', performance.now() - t0)
    }
}

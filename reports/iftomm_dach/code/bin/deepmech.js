const deepmech = {
    mecElement: mecElement,
    logging: false,
    loader: new Loader(),
    crop: new Crop(),
    get symbolClassifier() { return tf.loadLayersModel(this.loader) },
    get cropIdentifier() { return tf.loadLayersModel(this.crop) },

    async load() {
        const mec = JSON.parse(this.mecElement.innerHTML);
        const t0 = performance.now();
        console.log('Starting...')
        let tensor = tf.browser.fromPixels(this.mecElement._ctx.canvas, 1);
        tensor = tensor.div(255);
        tensor = tensor.expandDims();
        const newModel = toFullyConv(await this.symbolClassifier)

        this.logging && console.log('Beginning first scan: ', performance.now() - t0);
        const prediction = await newModel.predict(tensor, { batch_size: 1 }).arraySync()[0];
        this.logging && console.log('First prediction finished: ', performance.now() - t0);
        function extractInterestingInfo(pred, idx) {
            const y = idx * 4;
            return pred.map((inner, i) => {
                const max = Math.max(...inner);
                const maxIndex = inner.indexOf(max);
                const x = i * 4;
                return { x, y, max, maxIndex }
            });
        }
        function prepareForFiltering(e) {
            color = ['transparent', 'red', 'blue'];
            return { ...e, b: 32, h: 32, ls: color[e.maxIndex], lw: 3 }
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
        nodes = removeOverlaps(
            prediction.map(extractInterestingInfo).flat()
                .filter(e => e.maxIndex).sort((a, b) => a.max - b.max)
                .map(prepareForFiltering)
        )
        nodes.forEach((e, idx) => {
            mec.nodes.push({
                id: 'node' + idx, x: parseInt(e.x), y: parseInt(e.y),
                base: e.ls === 'red' ? false : true
            });
        });
        this.logging && console.log('Detected ', 0, 'nodes: ', performance.now() - t0);
        mirror = []
        boxes = mec.nodes.flatMap(node1 => {
            return nodes.map(node2 => {
                if (mec.constraints.find(c =>
                    c.p1 == node1.id && c.p2 == node2.id ||
                    c.p1 == node2.id && c.p2 == node1.id
                )) { console.log('hit!'); return; }

                x1 = Math.min(node1.x, node2.x);
                y1 = Math.min(node1.y, node2.y);
                x2 = Math.max(node1.x, node2.x);
                y2 = Math.max(node1.y, node2.y);

                if (x1 === x2 || y1 === y2) return

                m = 0
                if (x2 == node2.x) m++;
                if (y2 == node2.y) m += 2;
                mirror.push(m);

                return [y1, x1, y2, x2].map(c => (c + 16) / 360)
            });
        }).filter(e => e);
        if (boxes.length) {
            const boxInd = new Array(boxes.length).fill(0);
            // // TODO check if this is faster with for each box individually.
            // let blob = boxes.map((box, idx) => {
            //     const height = parseInt((box[2] - box[0]) / (box[3] - box[1]) * 360)
            //     let b = tf.image.cropAndResize(tensor, [box], [0], [height, 360]).arraySync()[0];
            //     let pad = parseInt((height - 360) / 2);
            //     pad = pad < 0 ? [[-pad, -pad], [0, 0]] : [[0, 0], [pad, pad]];
            //     b = tf.squeeze(b);

            //     if (mirror[idx] == 1)
            //         b = tf.reverse2d(b, 1);
            //     else if (mirror[idx] == 2)
            //         b = tf.reverse2d(b, 0);
            //     else if (mirror[idx] == 3)
            //         b = tf.reverse2d(b);

            //     b = tf.pad2d(b, pad);
            //     b = tf.expandDims(b, -1);

            //     b = tf.image.resizeBilinear(b, [360, 360]);
            //     this.logging && console.log('resized:', idx, ': ', performance.now() - t0);
            // });

            blob = tf.image.cropAndResize(tensor, boxes, boxInd, [360, 360]);
            blob = blob.arraySync().map(((b, idx) => {
                this.logging && console.log('start_:', idx, ': ', performance.now() - t0)
                box = boxes[idx]
                const height = parseInt((box[2] - box[0]) / (box[3] - box[1]) * 360)
                b = tf.image.resizeBilinear(b, [height, 360])
                this.logging && console.log('resized_1_:', idx, ': ', performance.now() - t0)
                let pad = parseInt((height - 360) / 2);
                pad = pad < 0 ? [[-pad, -pad], [0, 0]] : [[0, 0], [pad, pad]];
                b = tf.squeeze(b)
                b = tf.pad2d(b, pad)
                b = tf.expandDims(b, -1)
                b = tf.image.resizeBilinear(b, [360, 360])
                this.logging && console.log('resized_2_:', idx, ': ', performance.now() - t0)
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
            blob = tf.stack(blob)
            blob = blob.expandDims(-1)
            const newModel2 = await this.cropIdentifier;
            this.logging && console.log('Beginning second scan: ', performance.now() - t0);
            let constraints = newModel2.predict(
                blob, { batch_size: blob.shape[0] }).arraySync();
            this.logging && console.log('Second prediction finished: ', performance.now() - t0);
            constraints = constraints.map(c => c.indexOf(Math.max(...c)));
            let num = 0;
            constraints.forEach((c, idx) => {
                if (!c) return;
                num++;
                let color = ['transparent', 'green', 'yellow']
                const lin = {
                    y1: boxes[idx][0] * 360,
                    x1: boxes[idx][1] * 360,
                    y2: boxes[idx][2] * 360,
                    x2: boxes[idx][3] * 360,

                    ls: color[c],
                    lw: 3
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
                let p1 = mec.nodes.filter(node =>
                    node.x === parseInt(lin.x1 - 16) && node.y === parseInt(lin.y1 - 16))[0]
                p1 = p1 ? p1.id : undefined
                let p2 = mec.nodes.filter(node =>
                    node.x === parseInt(lin.x2 - 16) && node.y === parseInt(lin.y2 - 16))[0]
                p2 = p2 ? p2.id : undefined
                if (!p1 || !p2) console.log(lin, mec.nodes)
                else mec.constraints.push({
                    id: 'constraint' + idx, p1, p2,
                    len: { type: color[c] === 'green' ? 'const' : 'free' },
                    ori: { type: color[c] === 'green' ? 'free' : 'const' }
                });
            });
            this.logging && console.log('drew ', num, 'constraints: ', performance.now() - t0);
        }
        mecElement.innerHTML = JSON.stringify(mec);
        mecElement.init();
        mec2Deepmech();
        console.log('finished after: ', performance.now() - t0)
    }
}

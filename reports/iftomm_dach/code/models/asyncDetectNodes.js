/**
 * This was a part of deepmech but the tensorflow implementation with its async etc is way slower
 * than my manual impelementation... an evening wasted... but maybe someday I will learn something
 * or TFjs is sleeker and this can be used
 */

deepmech = {
    /**
     * Add handwritten nodes to mec
     * @param {object} image (tensor) which contains the image on the canvas. 
     * @param {object} nodeDetector model which detects nodes.
     */
    async detectNodes(image, nodeDetector, model, logging) {
        logging && console.log('Beginning first scan: ', performance.now() - this.t0);
        const prediction = nodeDetector.predict(image, { batch_size: 1 }).arraySync()[0];
        logging && console.log('First prediction finished: ', performance.now() - this.t0);

        console.log(performance.now() - this.t0)
        const max_idx = tf.argMax(prediction, 2);
        const max_val = tf.max(prediction, 2);

        console.log(performance.now() - this.t0)
        idx = await tf.whereAsync(tf.cast(max_idx, 'bool'));
        const scores = tf.gatherND(max_val, idx);
        idx = tf.mul(idx, 4);

        console.log(performance.now() - this.t0)
        let boxes = tf.concat([idx, tf.add(idx, 32)], 1);
        boxes = tf.cast(boxes, 'float32');

        winner = await tf.image.nonMaxSuppressionAsync(boxes, scores, 99, Number.EPSILON); // TODO check iouThreshold
        winner_idx = tf.gather(idx, winner);

        async function getCoords(label) {
            let _idx = await tf.whereAsync(tf.equal(max_idx, label));
            _idx = tf.mul(_idx, 4);
            const _sub = tf.sub(tf.expandDims(_idx, 0), tf.expandDims(winner_idx, 1));
            _no_match = tf.squeeze(tf.cast(tf.max(tf.abs(_sub), -1), 'bool'));
            _match = await tf.whereAsync(tf.logicalNot(_no_match));
            const s = _match.shape;
            _match = tf.squeeze(tf.slice(_match, [0, s[1] - 1], [s[0], 1]));
            return tf.gather(_idx, _match);
        }

        function setNodes(coords, base) {
            coords.arraySync().forEach(c => {
                const node = {
                    id: 'node' + model.nodes.length,
                    x: Math.round(c[1] - this.mecElement._interactor.view.x + 16),
                    y: Math.round(this.mecElement.height - c[0] - this.mecElement._interactor.view.y - 16),
                    base: base
                };
                mec.node.extend(node);
                model.addNode(node);
                node.init(model);
            })
        }

        console.log(performance.now() - this.t0)
        setNodes(await getCoords(1), false);
        console.log(performance.now() - this.t0)
        setNodes(await getCoords(2), true);

        logging && console.log('Detected ', nodes.length, 'nodes: ', performance.now() - this.t0);
    },
}
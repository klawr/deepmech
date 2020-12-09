
import * as tf from '@tensorflow/tfjs';
import NodeModel from './NodeModel';
import ConstraintModel from './ConstraintsModel';

export const deepmech = {
    detector: {
        nodeDetector: (async () => {
            /**
             * Transform a network into a fully convolutional network.
             * @method
             * @param {object} - A tenfsorflow.js LayersModel
             */
            function toFullyConv(model) {
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
            };
            return toFullyConv(await tf.loadLayersModel(new NodeModel()))
        })(),

        constraintDetector: (async () => {
            return await tf.loadLayersModel(new ConstraintModel());
        })(),

        /**
         * Add handwritten nodes to mec.
         * @param {object} image (tensor) which contains the image on the canvas. 
         * @returns {object} predicted nodes of the model.
         */
        detectNodes: async (image) => {
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

            const nodeDetector = await deepmech.detector.nodeDetector;
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
        detectConstraints: async (crops) => {
            const constraintDetector = await deepmech.detector.constraintDetector;
            return constraintDetector
                .predict(crops, { batch_size: crops.shape[0] })
                .arraySync()
                .map(c => c.indexOf(Math.max(...c)));
        }
    },

    predict: async () => {
        const element = mecElement;
        const model = element._model;

        let tensor = tf.browser.fromPixels(document.getElementById('deepmechCanvas'), 1);
        tensor = tensor.div(255).expandDims();

        const nodes = await deepmech.detector.detectNodes(tensor)
            .map(e => {
                e.base = e.maxIndex > 1 ? true : false;
                return e;
            });

        updateNodes(nodes);

        const [crops, info] = deepmech.detector.getCrops(tensor, element, model.nodes, model.constraints);
        if (crops) {
            const constraints = await deepmech.detector.detectConstraints(crops)
                .map((c, idx) => {
                if (!c) return undefined;
                const p1 = info[idx].p1;
                const p2 = info[idx].p2;
                if (!p1 || !p2) {
                    console.warn('Found no matching nodes for consraitns:', p1, p2, model.nodes);
                    return undefined;
                } else {
                    return {
                        id: 'constraint' + model.constraints.length, // TODO Think of a better id here.
                        p1, p2,
                        len: { type: c == 1 ? 'const' : 'free' },
                        ori: { type: c == 2 ? 'const' : 'free' }
                    };
                }
            }).filter(e => e);

            updateConstraints(constraints);
        }
        element._model.draw(element._g);
    },

    updateNodes(nodes) {
        if (!nodes) return;

        const model = mecElement._model;
        const view = mecElement._interactor.view;
        nodes.forEach(e => {
            const node = {
                // TODO Think of a better id here.
                id: e.id || 'Nx' + model.nodes.length,
                x: Math.round((e.x - view.x + 16) / view.scl),
                y: Math.round((mecElement.height - e.y - view.y - 16) / view.scl),
                base: e.base,
            };
            mec.node.extend(node);
            model.addNode(node);
            node.init(model);
        });
    },

    updateConstraints(constraints) {
        if (!constraints) return;

        const model = mecElement._model;
        constraints.forEach(e => {
            const constraint = Object.assign({ 
                id: 'cx' + model.constraints.length
            }, e);
            mec.constraint.extend(constraint);
            model.addConstraint(constraint);
            constraint.init(model);
        });
    },
}

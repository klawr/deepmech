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
            inputShape = layer.input.shape;
            outputDim = layer.getWeights()[1].shape[0];
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

if (typeof module !== 'undefined') module.exports = toFullyConv;
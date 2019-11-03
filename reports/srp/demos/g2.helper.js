g2.prototype.nn = function (layerArr, width, height, r) {
    function nodes(number) {
        const verticalSpacing = height / (number + 1);
        const currentLayer = [];
        for (let i = 1; i <= number; ++i) {
            currentLayer.push(i * verticalSpacing);
        }
        return currentLayer;
    }

    const layers = (pre, cur, idx, arr) => {
        const horizontalSpacing = width / arr.length;
        const x = idx * horizontalSpacing + horizontalSpacing / 2;
        for (y of cur) {
            old_x = (idx - 1) * horizontalSpacing + horizontalSpacing / 2;
            if (idx) {
                for (const old_y of pre) {
                    const w = Math.atan2(y - old_y, x - old_x);
                    const x1 = old_x + Math.cos(w) * r;
                    const x2 = x - Math.cos(w) * r;
                    const y1 = old_y + Math.sin(w) * r;
                    const y2 = y - Math.sin(w) * r;
                    this.vec({ x1, x2, y1, y2 });
                }
            }
            this.cir({ x, y, r });
        }
        return cur;
    }
    layerArr.map(nodes).reduce(layers, layerArr[0]);
    return this;
}

g2.prototype.nn_with_bias = function (layerArr, width, height, r) {
    function nodes(number, idx, arr) {
        const verticalSpacing = height / (number + 1);
        const currentLayer = [];
        for (let i = +(idx + 1 === arr.length); i <= number; ++i) {
            currentLayer.push(i * verticalSpacing + 2 * r);
        }
        return currentLayer;
    }

    const layers = (pre, cur, idx, arr) => {
        const horizontalSpacing = width / arr.length;
        const x = idx * horizontalSpacing + horizontalSpacing / 2;
        for (i in cur) {
            const bias = idx+1 !== arr.length && +i === 0;            
            const y = cur[i]
            old_x = (idx - 1) * horizontalSpacing + horizontalSpacing / 2;
            if (idx && !bias) {
                for (const old_y of pre) {
                    const w = Math.atan2(y - old_y, x - old_x);
                    const x1 = old_x + Math.cos(w) * r;
                    const x2 = x - Math.cos(w) * r;
                    const y1 = old_y + Math.sin(w) * r;
                    const y2 = y - Math.sin(w) * r;
                    this.vec({ x1, x2, y1, y2 });
                }
            }
            this.cir({ x, y, r });
            if (bias) {
                this.label({str:'1', font:'normal 40px serif'})
            }
        }
        return cur;
    }
    layerArr.map(nodes).reduce(layers, layerArr[0]);
    return this;
}
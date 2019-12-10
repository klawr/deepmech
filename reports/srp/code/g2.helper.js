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

g2.prototype.egrid = function ({x, y, s ,ky, kx, padding = 0}) {
    const p = padding;
    for (let i=0; i < ky; ++i) {
        for (let j=0; j < kx; ++j) {
            let fs = undefined;
            if (i < p || j < p || i > ky - p - 1 || j > kx - p - 1) {
                fs = 'grey'
            }
            this.rec({x: x + s*j, y: y + s*i, b:s, h:s, fs})
        }
    }
    return this;
}

g2.prototype.grid_connect = function({x1, y1, s, x2, y2, kernel_size=3, color, ld=[]}) {
    const dist = s * kernel_size;
        this.rec({x:x2, y:y2, b: s, h: s, fs:color})
            .beg({ls:color, ld})
        .rec({x: x1, y: y1, b: 3*s, h:3*s, lw:5})
        .lin({x1, y1, x2: x2 + s/2, y2: y2 + s/2})
        .lin({x1: x1+dist, y1: y1, x2: x2 + s/2, y2: y2 + s/2})
        .lin({x1: x1, y1: y1+dist, x2: x2 + s/2, y2: y2 + s/2})
        .lin({x1: x1+dist, y1: y1+dist, x2: x2 + s/2, y2: y2 + s/2})
        .end();
    return this;
}
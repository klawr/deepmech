const model = {
    w: [Math.random(), Math.random()],
    h(x) {
        return this.w.reduce((pre, cur, idx) => pre + x ** idx * cur, 0);
    }
}

function y(C) { return C * 1.8 + 32; }

function mse(h, y) { return (h - y) ** 2 / 2; }

function sgd(model, x) {
    model.w =  model.w.map((weight, idx) =>
        weight - (model.h(x) - y(x)) * x ** idx);
}

for (i = 0; i < 200; ++i) {
    const C = Math.random() * 100;
    sgd(model, C / 100);
    if (!(i % 20)) console.log('loss: ', mse(model.h(C), y(C)));
}

console.log('weights: ', model.w);
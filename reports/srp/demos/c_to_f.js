const model = {
    m: Math.random(),
    b: Math.random(),
    h(C) { return C * this.m + this.b; } 
}

function y(C) { return C * 1.8 + 32; }

function mse(h, y) { return (h - y)**2 / 2; }

function sgd(model, x) {
    temp_m = model.m - ((model.h(x) - y(x)) * x);
    temp_b = model.b - (model.h(x) - y(x));
    model.m = temp_m;
    model.b = temp_b;
}

for (i = 0; i < 200; ++i) {
    const F = Math.random();
    const loss = mse(model.h(F), y(F));
    sgd(model, F);
    if (i % 20 === 0) console.log('loss:', loss);
}
console.log('m:', model.m, 'b:', model.b)

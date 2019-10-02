const model = {
    m: Math.random(),
    n: Math.random(),
    b: Math.random(),
    h(C) { return C * this.m + C * C * this.n + this.b; } 
}

function y(C) { return C * 1.8 + 32; }

function mse(h, y) { return (h - y)**2 / 2; }

function sgd(model, x) {
    temp_m = model.m - ((model.h(x) - y(x)) * x);
    temp_n = model.n - ((model.h(x) - y(x)) * x * x);
    temp_b = model.b - (model.h(x) - y(x));
    model.m = temp_m;
    model.n = temp_n;
    model.b = temp_b;
}

for (i = 0; i < 4000; ++i) {
    const F = Math.random();
    const loss = mse(model.h(F), y(F));
    sgd(model, F);
}
console.log('m:', model.m, 'n:', model.n, 'b:', model.b)
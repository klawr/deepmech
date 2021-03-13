const model =
{
    "id": "MecModel2",
    "nodes": [
        { "id": "A0", "x": 0, "y": 0, "base": true },
        { "id": "B0", "x": 200, "y": 0, "base": true },
        { "id": "A", "x": 0, "y": 50 },
        { "id": "B", "x": 250, "y": 120 },
        { "id": "C", "x": 125, "y": 150 },
        { "id": "C0", "x": 350, "y": 0, "base": true }
    ],
    "constraints": [
        {
            "id": "a", "p1": "A0", "p2": "A", "len": { "type": "const" },
            "ori": { "type": "free" }
        },
        { "id": "b", "p1": "A", "p2": "B", "len": { "type": "const" } },
        { "id": "c", "p1": "B0", "p2": "B", "len": { "type": "const" } },
        { "id": "b2", "p1": "A", "p2": "C", "len": { "type": "const" }, "ori": { "type": "const", "ref": "b" } }
    ],
    "views": [
        { "show": "pos", "of": "C", "as": "trace", "mode": "preview", "Dt": 2, "fill": "orange" },
        { "show": "vel", "of": "C", "as": "vector", "at": "C0" }
    ]
}

globalThis.mecElement = document.getElementById('mecElement');
globalThis.mecElement.innerHTML = JSON.stringify(model);

window.onresize = function () {
    globalThis.mecElement.width = globalThis.window.innerWidth;
    globalThis.mecElement.height = globalThis.window.innerHeight;
};

window.onload = function () {
    globalThis.mecElement.width = globalThis.window.innerWidth;
    globalThis.mecElement.height = globalThis.window.innerHeight;
};

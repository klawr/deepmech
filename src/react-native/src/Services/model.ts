import { IModel } from 'mec2-module';

export const model: IModel = {
    "id": "testModel",
    "gravity": true,
    "nodes": [
        { "id": "A0", "x": 75, "y": 50, "base": true },
        { "id": "A", "x": 70, "y": 100 },
        { "id": "B", "x": 275, "y": 170 },
        { "id": "B0", "x": 275, "y": 50, "base": true },
        { "id": "C", "x": 125, "y": 175 }
    ],
    "constraints": [
        {
            "id": "a", "p1": "A0", "p2": "A", "len": { "type": "const" },
            "ori": { "type": "drive", "Dt": 2, "Dw": 6.28, "input": 1 }
        }, {
            "id": "b", "p1": "A", "p2": "B", "len": { "type": "const" }
        }, {
            "id": "c", "p1": "B0", "p2": "B", "len": { "type": "const" }
        }, {
            "id": "d", "p1": "B", "p2": "C", "len": { "type": "const" },
            "ori": { "ref": "b", "type": "const" }
        }
    ]
};
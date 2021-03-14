import { IG2 } from "./g2";
import mecElementSingleton from "./mecElement";

export interface IMecProperty {
    id: string,
    init: (model: IMecModel) => void,
    remove: () => void,
}

export interface INode extends IMecProperty {
    x: number,
    y: number,
    base: boolean,
    drag(): void; 
}

export enum ConstraintMode { "free", "const" }
export interface IConstraint extends IMecProperty {
    p1: string,
    p2: string,
    len:  { type: ConstraintMode },
    ori:  { type: ConstraintMode },
}

export interface IView extends IMecProperty {
    id: string,
    as: string,
}

export interface IMecModelPlugIns {
    "nodes": INode[],
    "views": IView[],
    "constraints": IConstraint[]
}

export interface IMecModel extends IMecModelPlugIns {
    id: string,
    plugIns: any,
    draw: (g2: IG2) => void,
    add: (list: keyof IMecModelPlugIns, o: any) => any,
    preview: () => void,
    pose: () => void,

}

export default function mecModelSingleton(): IMecModel {
    return mecElementSingleton()._model;

}


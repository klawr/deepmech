import { IConstraint, INode } from "./mecModel";

export interface IMec2Plugin<T> {
    extend(arg: Object): T;
}

export interface IMec2 {
    node: IMec2Plugin<INode>;
    constraint: IMec2Plugin<IConstraint>;
}

export default function mec2Singleton() {
    return (globalThis as any).mec as any;
}

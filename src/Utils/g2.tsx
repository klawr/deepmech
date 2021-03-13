
export interface IG2 {};

export default function getG2Singletion(): IG2 {
    return (globalThis as any).g2 as any;
}

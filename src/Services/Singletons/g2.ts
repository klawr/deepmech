
export interface IG2 {};

export default function getG2Singleton(): IG2 {
    return (globalThis as any).g2 as any;
}

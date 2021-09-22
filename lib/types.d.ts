export declare type DebugFn = (...args: any[]) => any;
export declare type DebugPropT = boolean;
export interface DownloadProgressT {
    current: number;
    length: number;
    totalMb: number;
    lastPrintedAt: number;
}
export declare type CallbackFn = (...args: any[]) => any;
export { SpawnOptions } from 'child_process';
export interface RedisMemoryInstancePropBaseT {
    args?: string[];
    port?: number | null;
}
export interface RedisMemoryInstancePropT extends RedisMemoryInstancePropBaseT {
    ip?: string;
}
export declare type ErrorVoidCallback = (err: any) => void;
export declare type EmptyVoidCallback = () => void;
//# sourceMappingURL=types.d.ts.map
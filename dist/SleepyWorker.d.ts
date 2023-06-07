export default class SleepyWorker extends EventTarget {
    worker?: Worker;
    timeout?: number;
    stringUrl: string | URL;
    constructor(stringUrl: string | URL);
    postMessage(message: any, transfer?: Transferable[]): void;
}

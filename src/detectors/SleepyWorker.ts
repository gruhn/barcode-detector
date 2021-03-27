
export default class SleepyWorker extends EventTarget {
  worker? : Worker;
  timeout? : number;
  stringUrl : string | URL;

  constructor(stringUrl: string | URL) {
    super()
    this.stringUrl = stringUrl
  }

  postMessage(message : any, transfer? : Transferable[]) {
    if (this.worker === undefined) {
      this.worker = new Worker(this.stringUrl)
      this.worker.onmessage = (event : MessageEvent) => {
        this.dispatchEvent(new MessageEvent("message", { data: event.data }))
      }
    } else {
      self.clearTimeout(this.timeout)
    }

    this.worker.postMessage(message, transfer)

    this.timeout = self.setTimeout(() => {
      this.worker.terminate()
      this.worker = undefined
    }, 2500)
  }

}
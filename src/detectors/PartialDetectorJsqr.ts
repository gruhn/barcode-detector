import PartialDetector from "./PartialDetector"
import SleepyWorker from "./SleepyWorker"
import inlineWorkerCode from "./workers/jsqr/inline-worker.js"
import { DetectedBarcode } from "../basic-types"
import { imageDataFrom } from "./image-data"

export default class PartialDetectorJsqr implements PartialDetector {

  worker : SleepyWorker
  workerLoad : number
  messageCount : number

  constructor() {
    this.worker =  new SleepyWorker(inlineWorkerCode);
    this.workerLoad = 0
    this.messageCount = 0
  }

  async detect(image : ImageBitmapSource) : Promise<DetectedBarcode[]> {
    // Immediately return "no result" when a certain number of jobs are already 
    // in the workers message queue. In use cases like continuously scanning
    // frames from a camera stream, detect() can be called very frequently. This
    // can quickly fill up memory. However, if we only allow one message at a 
    // time, we can't deal with multiple non-continuous detect() calls, e.g. 3
    // QR code image are picked via file input to be decoded. 
    // The current limit is kind of arbitrary, Not sure what a good balance is.
    if (this.workerLoad > 5) {
      return []
    } else {
      this.workerLoad++

      const messageId = this.messageCount++
      const imageData = await imageDataFrom(image)

      this.worker.postMessage({ id: messageId, imageData }, [imageData.data.buffer])

      const detectedBarcodes : Array<DetectedBarcode> = await new Promise(resolve => {
        this.worker.addEventListener("message", (event : Event) => {
          const { id, detectedBarcodes } = (event as MessageEvent).data

          if (id === messageId) {
            resolve(detectedBarcodes as Array<DetectedBarcode>)
          }
        })
      })

      this.workerLoad--

      return detectedBarcodes;
    }
  }

}
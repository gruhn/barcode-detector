// spec: https://wicg.github.io/shape-detection-api/#barcode-detection-api  

import { BarcodeDetectorOptions, BarcodeFormat, DetectedBarcode } from "./basic-types"
import { imageDataFrom } from "./image-data"
import  SleepyWorker  from "./SleepyWorker"
import inlineWorkerCode from "./worker/inline-worker"

const allSupportedFormats : BarcodeFormat[] = [ "qr_code" ]

export default class BarcodeDetector {

  worker : SleepyWorker
  workerLoad : number
  messageCount : number

  constructor (barcodeDetectorOptions? : BarcodeDetectorOptions) {
    // SPEC: A series of BarcodeFormats to search for in the subsequent detect() calls. If not present then the UA SHOULD 
    // search for all supported formats.
    const formats = barcodeDetectorOptions?.formats ?? allSupportedFormats

    // SPEC: If barcodeDetectorOptions.formats is present and empty, then throw a new TypeError.
    if (formats.length === 0) {
      throw new TypeError("") // TODO pick message
    }

    // SPEC: If barcodeDetectorOptions.formats is present and contains unknown, then throw a new TypeError.
    if (formats.includes("unknown")) {
      throw new TypeError("") // TODO pick message
    }

    this.worker =  new SleepyWorker(inlineWorkerCode);
    this.workerLoad = 0
    this.messageCount = 0
  }

  static async getSupportedFormats() : Promise<BarcodeFormat[]> {
    return allSupportedFormats
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
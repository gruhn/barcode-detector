// spec: https://wicg.github.io/shape-detection-api/#barcode-detection-api  

import SleepyWorker from "./SleepyWorker"
import { imageDataFrom } from "./image-data"
import inlineWorkerCode from "./inline-worker-code.js"

type BarcodeFormatIn
  = "aztec"
  | "code_128"
  | "code_39"
  | "code_93"
  | "codabar"
  | "data_matrix"
  | "ean_13"
  | "ean_8"
  | "itf"
  | "pdf417"
  | "qr_code"
  | "upc_a"
  | "upc_e"

type BarcodeFormatOut
  = BarcodeFormatIn
  | "unknown"

type NonEmptyArray<T> 
  = [T, ...T[]]

interface BarcodeDetectorOptions {
  // A series of BarcodeFormats to search for in the subsequent detect() calls. 
  // If not present then the UA SHOULD search for all supported formats.
  formats? : NonEmptyArray<BarcodeFormatIn>
};

interface Point2D {
  x : Number, 
  y : Number
};

interface DetectedBarcode {
  boundingBox : DOMRectReadOnly,
  rawValue : String,
  format : BarcodeFormatOut,
  cornerPoints : ReadonlyArray<Point2D>
};

export default class BarcodeDetector {

  worker : SleepyWorker
  workerBusy : boolean

  constructor (barcodeDetectorOptions? : BarcodeDetectorOptions) {
    this.worker = new SleepyWorker(inlineWorkerCode)
    this.workerBusy = false
  }

  getSupportedFormats() : Promise<Array<BarcodeFormatOut>> {
    return Promise.resolve([
      // "code_128",
      // "code_39",
      // "ean_13",
      // "ean_8",
      // "itf",
      "qr_code",
      // "upc_a",
      // "upc_e"
    ])
  }

  async detect(image : ImageBitmapSource) : Promise<Array<DetectedBarcode>> {
    // [TODO]
    // Note that if the ImageBitmapSource is an object with either a horizontal 
    // dimension or a vertical dimension equal to zero, then the Promise will 
    // be simply resolved with an empty sequence of detected objects.

    // If worker can't process frames fast enough, memory quickly fills up.
    // Make sure to process only one frame at a time.
    if (this.workerBusy) {
      return []
    } else {
      this.workerBusy = true

      const imageData = await imageDataFrom(image)
      this.worker.postMessage(imageData, [imageData.data.buffer])

      try {
        const result : any = await new Promise(resolve => {
          this.worker.addEventListener("message", (event : any) => {
            resolve(event.data)
          });
        })

        if (result === null) {
          return []
        } else if (result.content === "") {
          return []
        } else {
          const cornerPoints = Object.freeze([
            result.location.topLeftCorner,
            result.location.topRightCorner,
            result.location.bottomRightCorner,
            result.location.bottomLeftCorner
          ])

          const x1 = Math.min(...cornerPoints.map(point => point.x))
          const x2 = Math.max(...cornerPoints.map(point => point.x))
          const y1 = Math.min(...cornerPoints.map(point => point.y))
          const y2 = Math.max(...cornerPoints.map(point => point.y))

          return [{ 
            boundingBox: DOMRectReadOnly.fromRect({ // TODO is this correct?
              x: x1,
              y: y1,
              width: x2 - x1,
              height: y2 - y1
            }), 
            rawValue: result.data,
            format: "qr_code",
            cornerPoints         
          }]
        }
      } catch (error) {
        return []
      } finally {
        this.workerBusy = false;
      }
    }
  }
}
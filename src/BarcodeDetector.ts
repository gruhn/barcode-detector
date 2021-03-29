// spec: https://wicg.github.io/shape-detection-api/#barcode-detection-api  

import { BarcodeDetectorOptions, BarcodeFormat, DetectedBarcode } from "./basic-types"
import PartialDetector from "./detectors/PartialDetector"
// import PartialDetectorJsqr from "./detectors/PartialDetectorJsqr"
import PartialDetectorZbar from "./detectors/PartialDetectorZbar"

const detectorForFormat : Map<BarcodeFormat, PartialDetector> = new Map([
  // [ "aztec" ],
  // [ "code_128" ],
  // [ "code_39" ],
  // [ "code_93" ],
  // [ "codabar" ],
  // [ "data_matrix" ],
  // [ "ean_13" ],
  // [ "ean_8" ],
  // [ "itf" ],
  // [ "pdf417" ],
  [ "qr_code", new PartialDetectorZbar() ]
  // [ "qr_code" ],
  // [ "upc_a" ],
  // [ "upc_e" ],
])

const allSupportedFormats : BarcodeFormat[] = [
  "code_128",
  "code_39",
  "code_93",
  "codabar",
  "ean_13",
  "ean_8",
  "itf",
  "qr_code"
]

export default class BarcodeDetector {

  detectors : Set<PartialDetector>

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

    this.detectors = new Set(formats
      .map(format => detectorForFormat.get(format))
      .filter(detector => detector !== undefined)
    )
  }

  async getSupportedFormats() : Promise<BarcodeFormat[]> {
    return allSupportedFormats
  }

  async detect(image : ImageBitmapSource) : Promise<DetectedBarcode[]> {
    // [TODO]
    // SPEC: Note that if the ImageBitmapSource is an object with either a horizontal 
    // dimension or a vertical dimension equal to zero, then the Promise will 
    // be simply resolved with an empty sequence of detected objects.

    const results : DetectedBarcode[][] = await Promise.all(
      Array.from(this.detectors).map(detector => detector.detect(image))
    )

    const resultsFlat = [].concat(...results)

    // TODO: if detector can detect multiple kinds of codes filter results
    // by requested formats

    return resultsFlat
  }
}
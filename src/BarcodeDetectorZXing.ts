// spec: https://wicg.github.io/shape-detection-api/#barcode-detection-api  

import { BarcodeDetectorOptions, BarcodeFormat, DetectedBarcode } from "./basic-types"
import { imageDataFrom } from "./image-data"
import * as ZXing from "@zxing/library"

const mapFormat = new Map<BarcodeFormat, ZXing.BarcodeFormat>([

  [ "aztec", ZXing.BarcodeFormat.AZTEC ],
  // [ "codabar", ZXing.BarcodeFormat.CODABAR ],
  [ "code_39", ZXing.BarcodeFormat.CODE_39 ],
  // [ "code_93", ZXing.BarcodeFormat.CODE_93 ],
  [ "code_128", ZXing.BarcodeFormat.CODE_128 ],
  [ "data_matrix", ZXing.BarcodeFormat.DATA_MATRIX ],
  [ "ean_8", ZXing.BarcodeFormat.EAN_8 ],
  [ "ean_13", ZXing.BarcodeFormat.EAN_13 ],
  [ "itf", ZXing.BarcodeFormat.ITF ],
  [ "pdf417", ZXing.BarcodeFormat.PDF_417 ],
  [ "qr_code", ZXing.BarcodeFormat.QR_CODE ],
  [ "upc_a", ZXing.BarcodeFormat.UPC_A ],
  [ "upc_e", ZXing.BarcodeFormat.UPC_E ]

]) 

const mapFormatInv = new Map<ZXing.BarcodeFormat, BarcodeFormat>(
  Array.from(mapFormat).map(([key, val]) => [val, key])
)

const allSupportedFormats : BarcodeFormat[] = Array.from(mapFormat.keys())

const mapResult = (result : ZXing.Result) : DetectedBarcode => {
  const format = mapFormatInv.get(result.getBarcodeFormat())
  const rawValue = result.getText()

  const cornerPoints = Object.freeze(
    result
      .getResultPoints()
      .map(point => ({ x: point.getX(), y: point.getY() }))
  )

  const x_min = Math.min(...cornerPoints.map(point => point.x))
  const x_max = Math.max(...cornerPoints.map(point => point.x))
  const y_min = Math.min(...cornerPoints.map(point => point.y))
  const y_max = Math.max(...cornerPoints.map(point => point.y))

  const boundingBox = DOMRectReadOnly.fromRect({
    x: x_min,
    y: y_min,
    width: x_max - x_min,
    height: y_max - y_min
  }) 

  return { format, rawValue, cornerPoints, boundingBox }
}

export default class BarcodeDetector {

  reader : ZXing.MultiFormatReader

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

    const hints = new Map([
      [ ZXing.DecodeHintType.POSSIBLE_FORMATS, formats.map(format => mapFormat.get(format)) ]
    ])

    this.reader = new ZXing.MultiFormatReader()
    this.reader.setHints(hints)
  }

  static async getSupportedFormats() : Promise<BarcodeFormat[]> {
    return allSupportedFormats
  }

  // INVESTIGATE: 
  // * native api on Mac Chrome gives "Source not supported" for Blob
  // * only two corner points for code_39
  async detect(image : ImageBitmapSource) : Promise<DetectedBarcode[]> {
    // TODO: [SPEC]
    // Note that if the ImageBitmapSource is an object with either a horizontal dimension or a vertical dimension equal
    // to zero, then the Promise will be simply resolved with an empty sequence of detected objects.

    const imageData = await imageDataFrom(image)
    const canvas = document.createElement("canvas");
    const canvasCtx = canvas.getContext("2d");
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    canvasCtx.putImageData(imageData, 0, 0);

    try {
      const luminanceSource = new ZXing.HTMLCanvasElementLuminanceSource(canvas);
      const binaryBitmap = new ZXing.BinaryBitmap(new ZXing.HybridBinarizer(luminanceSource));
      const result = this.reader.decode(binaryBitmap);

      return [ mapResult(result) ] 
    } catch (error) {
      console.error(error);
      
      return []
    }
  }
}
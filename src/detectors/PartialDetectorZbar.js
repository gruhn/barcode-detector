// import PartialDetector from "./PartialDetector"
// import { DetectedBarcode } from "../basic-types"
import { imageDataFrom } from "./image-data"
import ZBarFactory from "./a.out.js"

const formatTranslation = new Map([

  // [ "", "aztec" ],
  [ "CODE-128", "code_128" ],
  [ "CODE-39", "code_39" ],
  [ "CODE-93", "code_93" ],
  [ "Codebar", "codabar" ],
  // [ "", "data_matrix" ],
  [ "EAN-13", "ean_13" ], // TODO: interprets "upc_a" and "upc_e" as "ean_13"
  [ "EAN-8", "ean_8" ],
  [ "I2/5", "itf" ],
  // [ "", "pdf417" ],
  [ "QR-Code", "qr_code" ],
  // [ "", "upc_a" ],
  // [ "", "upc_e "]

]) 

// Execute the application code when the WebAssembly module is ready.
const wasmModuleReady = new Promise(resolve => {
  const ZBar = ZBarFactory()

  ZBar.onRuntimeInitialized = () => {
    console.log("READY");

    // set the function that should be called whenever a barcode is detected
    ZBar['processResult'] = (formatZBar, rawValue, polygon) => {
      console.log(formatZBar);

      const cornerPoints = Object.freeze([
        { x: polygon[0], y: polygon[1] },
        { x: polygon[2], y: polygon[3] },
        { x: polygon[4], y: polygon[5] },
        { x: polygon[6], y: polygon[7] },
      ])

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

      const format = formatTranslation.get(formatZBar) ?? "unknown"

      console.log({ 
        format, 
        rawValue,
        cornerPoints,
        boundingBox
      })
    }

    resolve({
      scan_image: ZBar.cwrap('scan_image', '', ['number', 'number', 'number']),
      create_buffer: ZBar.cwrap('create_buffer', 'number', ['number', 'number']),
      destroy_buffer: ZBar.cwrap('destroy_buffer', '', ['number']),
      
      ZBar
    });
  }
})

export default class PartialDetectorJsqr { // implements PartialDetector {

  async detect(image) {
    const api = await wasmModuleReady

    const imageData = await imageDataFrom(image)

    // convert the image data to grayscale 
    const grayData = []
    const d = imageData.data;
    for (var i = 0, j = 0; i < d.length; i += 4, j++) {
      grayData[j] = (d[i] * 66 + d[i + 1] * 129 + d[i + 2] * 25 + 4096) >> 8;
    }

    // put the data into the allocated buffer on the wasm heap.
    const p = api.create_buffer(imageData.width, imageData.height);
    api.ZBar.HEAP8.set(grayData, p);

    // call the scanner function
    api.scan_image(p, imageData.width, imageData.height)

    // clean up 
      //(this is not really necessary in this example as we could reuse the buffer, but is used to demonstrate how you can manage Wasm heap memory from the js environment)
    api.destroy_buffer(p);

    return []
  }

}
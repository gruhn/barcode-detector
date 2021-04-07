import jsQR, { QRCode } from "jsqr"
import { DetectedBarcode } from "../basic-types"

declare var self: DedicatedWorkerGlobalScope;
export {};

function detectWithJsQR(imageData : ImageData) : Array<DetectedBarcode> {
  try {
    const qrcode : QRCode = jsQR(
      imageData.data, 
      imageData.width, 
      imageData.height, 
      { inversionAttempts: "dontInvert" }
    );

    if (qrcode === null || qrcode.data === "") {
      return []
    } else {
      const { location, data } = qrcode

      const cornerPoints = Object.freeze([
        location.topLeftCorner,
        location.topRightCorner,
        location.bottomRightCorner,
        location.bottomLeftCorner
      ])

      const x1 = Math.min(...cornerPoints.map(point => point.x))
      const x2 = Math.max(...cornerPoints.map(point => point.x))
      const y1 = Math.min(...cornerPoints.map(point => point.y))
      const y2 = Math.max(...cornerPoints.map(point => point.y))

      return [{ 
        boundingBox: DOMRectReadOnly.fromRect({
          x: x1,
          y: y1,
          width: x2 - x1,
          height: y2 - y1
        }), 
        rawValue: data,
        format: "qr_code",
        cornerPoints         
      }]
    }
  } catch (error) {
    console.error(error)
    return []
  }
}

self.addEventListener("message", (event : MessageEvent) => {
  const { id, imageData }= event.data 

  const detectedBarcodes = detectWithJsQR(imageData)

  self.postMessage({ id, detectedBarcodes })
});
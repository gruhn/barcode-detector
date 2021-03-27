import { DetectedBarcode } from "../basic-types"

export default interface PartialDetector {
  detect(image : ImageBitmapSource) : Promise<DetectedBarcode[]>

}
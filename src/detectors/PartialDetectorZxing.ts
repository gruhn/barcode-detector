import PartialDetector from "./PartialDetector"
import { DetectedBarcode } from "../basic-types"
// import { imageDataFrom } from "./image-data"
import * as ZXing from '@zxing/library';



export default class PartialDetectorZxing implements PartialDetector {

  constructor() {
  }

  async detect(image : ImageBitmapSource) : Promise<DetectedBarcode[]> {
    const hints = new Map();

    hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);

    const reader = new MultiFormatReader();

    reader.setHints(hints);

    const luminanceSource = new RGBLuminanceSource(imgByteArray, imgWidth, imgHeight);
    const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));

    reader.decode(binaryBitmap);
  }

}
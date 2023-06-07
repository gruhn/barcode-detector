import { BarcodeDetectorOptions, BarcodeFormat, DetectedBarcode } from "./basic-types";
import SleepyWorker from "./SleepyWorker";
export default class BarcodeDetector {
    worker: SleepyWorker;
    workerLoad: number;
    messageCount: number;
    constructor(barcodeDetectorOptions?: BarcodeDetectorOptions);
    static getSupportedFormats(): Promise<BarcodeFormat[]>;
    detect(image: ImageBitmapSource): Promise<DetectedBarcode[]>;
}

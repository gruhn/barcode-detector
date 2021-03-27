// spec: https://wicg.github.io/shape-detection-api/#barcode-detection-api  

export type BarcodeFormat
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
  | "unknown"

export interface BarcodeDetectorOptions {
  formats? : Array<BarcodeFormat>
};

export interface Point2D {
  x : Number, 
  y : Number
};

export interface DetectedBarcode {
  boundingBox : DOMRectReadOnly,
  rawValue : String,
  format : BarcodeFormat,
  cornerPoints : ReadonlyArray<Point2D>
};
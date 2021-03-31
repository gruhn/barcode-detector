# :construction: WIP: BarcodeDetector Polyfill :construction: 
Spec compliant polyfill of the [Barcode Detection API](https://wicg.github.io/shape-detection-api/#barcode-detection-api).
It can be used for barcode/QR-code recognition in images from various kinds of 
sources including `<canvas>`, `<img>`, `<image>` (inside SVGs), `<video>`, `File`, `Blob`, `ImageData`, `ImageBitmap`, `OffscreenCanvas`.

[TODO: live demos]

## Installation

```sh
npm install barcode-detector
```
```js
import BarcodeDetector from "barcode-detector"

// polyfill unless already supported
if (!("BarcodeDetector" in window)) {
  window.BarcodeDetector = BarcodeDetector
}
```

## Usage

For in-depth documentation checkout the [corresponding MDN page](https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API).

### Supported Formats

 - :heavy_check_mark: `aztec`
 - :heavy_check_mark: `code_128`
 - :heavy_check_mark: `code_39`
 - :x: `code_93`
 - :x: `codabar`
 - :heavy_check_mark: `data_matrix`
 - :heavy_check_mark: `ean_13`
 - :heavy_check_mark: `ean_8`
 - :heavy_check_mark: `itf`
 - :heavy_check_mark: `pdf417`
 - :heavy_check_mark: `qr_code` 
 - :x: `upc_a`
 - :x: `upc_e`

# :construction: WIP: BarcodeDetector Polyfill :construction: 
Spec compliant polyfill of the [Barcode Detection API](https://wicg.github.io/shape-detection-api/#barcode-detection-api).
It can be used for barcode/QR-code recognition in images from various kinds of 
sources including `<canvas>`, `<img>`, `<svg>`, `<video>`, `File`, `Blob`, `ImageData`, `ImageBitmap`, `OffscreenCanvas`.

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

 - :x: `aztec`
 - :heavy_check_mark: `code_128`
 - :heavy_check_mark: `code_39`
 - :heavy_check_mark: `code_93`
 - :heavy_check_mark: `codabar`
 - :x: `data_matrix`
 - :heavy_check_mark: `ean_13`
 - :heavy_check_mark: `ean_8`
 - :heavy_check_mark: `itf`
 - :x: `pdf417`
 - :heavy_check_mark: `qr_code` 
 - :heavy_check_mark: `upc_a` (interpreted as `ean_13`)
 - :heavy_check_mark: `upc_e` (interpreted as `ean_13`)

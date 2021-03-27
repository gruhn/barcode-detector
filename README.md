# :construction: WIP: BarcodeDetector Polyfill :construction: 
Spec compliant polyfill of the [Barcode Detection API](https://wicg.github.io/shape-detection-api/#barcode-detection-api).
It can be used for barcode/QR-code recognition in images from various kinds of 
sources including `<canvas>`, `<img>`, `<video>`, `Blob`, `ImageData`, ...

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
 - :x: `code_128`
 - :x: `code_39`
 - :x: `code_93`
 - :x: `codabar`
 - :x: `data_matrix`
 - :x: `ean_13`
 - :x: `ean_8`
 - :x: `itf`
 - :x: `pdf417`
 - :heavy_check_mark: `qr_code` 
 - :x: `upc_a`
 - :x: `upc_e`

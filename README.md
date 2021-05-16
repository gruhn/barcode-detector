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

```js
// pick barcode formats. Other formats will be ignored
const barcodeDetector = new BarcodeDetector({ formats: ["qr_code"] })

// directly pass an image element, video element, ...
const barcodes = await barcodeDetector.detect(someImageSource)

// can detect multiple barcodes in one image
const [ barcode1, barcode2, ...evenMoreBarcodes ] = barcodes

// access encoded string
const { rawValue } = barcode1
```

For in-depth documentation checkout the [corresponding MDN page](https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API).

### Supported Formats

`src/BarcodeDetectorJsqr.ts`:
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

`src/BarcodeDetectorZXing.ts` (not exposed at the moment):
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

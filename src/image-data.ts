
function imageDataFromCanvas(image : CanvasImageSource, width : number, height : number) : ImageData {
  const canvas = document.createElement("canvas");
  const canvasCtx = canvas.getContext("2d");

  canvas.width = width;
  canvas.height = height;

  canvasCtx.drawImage(image, 0, 0, width, height);

  return canvasCtx.getImageData(0, 0, width, height);
}

async function imageDataFromBlob(blob : Blob) : Promise<ImageData> {
  // turn blob into an img element and pass back to imageDataFrom
  const url = URL.createObjectURL(blob)

  const image = new Image()
  image.src = url

  await new Promise((resolve, reject) => {
    image.onload = resolve
    image.onerror = reject
  })

  URL.revokeObjectURL(url)

  return imageDataFrom(image)
}

export async function imageDataFrom(image : ImageBitmapSource) : Promise<ImageData> {
  // spec quoted from:
  // https://wicg.github.io/shape-detection-api/#image-sources-for-detection

  // [TODO]
  // If any ImageBitmapSource have an effective script origin (origin) which is 
  // not the same as the Document’s effective script origin, then reject the 
  // Promise with a new DOMException whose name is SecurityError.

  if (image instanceof HTMLImageElement) {

    // [TODO]
    // When an ImageBitmapSource object represents an HTMLImageElement, the 
    // element’s image must be used as the source image. Specifically, when an 
    // ImageBitmapSource object represents an animated image in an 
    // HTMLImageElement, the user agent must use the default image of the 
    // animation (the one that the format defines is to be used when animation 
    // is not supported or is disabled), or, if there is no such image, the 
    // first frame of the animation.

    // [SPEC]
    // If the ImageBitmapSource is an HTMLImageElement object that is in the 
    // Broken (HTML Standard §img-error) state, then reject the Promise with a 
    // new DOMException whose name is InvalidStateError, and abort any further 
    // steps.
    // [SPEC]
    // If the ImageBitmapSource is an HTMLImageElement object that is not fully 
    // decodable then reject the Promise with a new DOMException whose name is 
    // InvalidStateError, and abort any further steps
    try {
      image.decode()
    } catch (_) {
      throw new DOMException("HTMLImageElement is not decodable", "InvalidStateError")
    }

    return imageDataFromCanvas(image, image.naturalWidth, image.naturalHeight)

  } else if (image instanceof SVGImageElement) {

    // TODO width/height is a little bit arbitrary
    return imageDataFromCanvas(image, 640, 480)

  } else if (image instanceof HTMLVideoElement) {

    // [SPEC]
    // If the ImageBitmapSource is an HTMLVideoElement object whose readyState 
    // attribute is either HAVE_NOTHING or HAVE_METADATA then reject the Promise 
    // with a new DOMException whose name is InvalidStateError, and abort any 
    // further steps.
    const HAVE_NOTHING = 0, HAVE_METADATA = 1;
    if (image.readyState === HAVE_NOTHING || image.readyState === HAVE_METADATA) {
      throw new DOMException("", "InvalidStateError")
    }

    // [SPEC]
    // When an ImageBitmapSource object represents an HTMLVideoElement, then 
    // the frame at the current playback position when the method with the 
    // argument is invoked must be used as the source image when processing the 
    // image, and the source image’s dimensions must be the intrinsic dimensions 
    // of the media resource (i.e. after any aspect-ratio correction has been applied).
    return imageDataFromCanvas(image, image.videoWidth, image.videoHeight)

  } else if (image instanceof HTMLCanvasElement) {

    // [TODO]
    // When an ImageBitmapSource object represents an HTMLCanvasElement, the 
    // element’s bitmap must be used as the source image.
    
    // [TODO]
    // If the ImageBitmapSource argument is an HTMLCanvasElement whose bitmap’s 
    // origin-clean (HTML Standard §concept-canvas-origin-clean) flag is false, 
    // then reject the Promise with a new DOMException whose name is 
    // SecurityError, and abort any further steps.

    const canvasCtx = image.getContext("2d")
    return canvasCtx.getImageData(0, 0, image.width, image.height)

  } else if ('ImageBitmap' in window && image instanceof ImageBitmap) {

    return imageDataFromCanvas(image, image.width, image.height)

  // Can't perform instanceof check when OffscreenCanvas not supported. Thus
  // need to feature detect first.
  } else if ('OffscreenCanvas' in window && image instanceof OffscreenCanvas) {

    const canvasCtx = image.getContext("2d")
    return canvasCtx.getImageData(0, 0, image.width, image.height)

  } else if (image instanceof Blob) {

    return imageDataFromBlob(image)

  } else if (image instanceof ImageData) {

    return image

  } else {
    // TODO TypeError?
  }
}
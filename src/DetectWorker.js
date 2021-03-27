import jsQR from "jsqr"

self.addEventListener("message", function(event) {
  const imageData = event.data;

  try {
    const result = jsQR(
      imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert"
      }
    );

    self.postMessage(result);
  } catch (error) {
    if (!(error instanceof RangeError)) {
      throw error;
    }
  }
});
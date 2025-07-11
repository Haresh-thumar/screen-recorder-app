/// <reference lib="webworker" />

// addEventListener('message', ({ data }) => {
//   const response = `worker response to ${data}`;
//   postMessage(response);
// });

addEventListener('message', ({ data }) => {
  if (data.type === 'process') {
    const { imageData, filter } = data;

    // Clone the image data for processing
    const clonedData = new ImageData(
      new Uint8ClampedArray(imageData.data),
      imageData.width,
      imageData.height
    );

    // Apply selected filter
    const processedData = applyFilter(clonedData, filter);

    // Send processed data back to main thread
    postMessage({
      type: 'processed',
      imageData: processedData,
    });
  }
});

function applyFilter(imageData: ImageData, filterType: string): ImageData {
  const { data, width, height } = imageData;

  switch (filterType) {
    case 'grayscale':
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg; // R
        data[i + 1] = avg; // G
        data[i + 2] = avg; // B
      }
      break;

    case 'sepia':
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
        data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
        data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
      }
      break;

    case 'invert':
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i]; // R
        data[i + 1] = 255 - data[i + 1]; // G
        data[i + 2] = 255 - data[i + 2]; // B
      }
      break;

    case 'blur':
      // Simple box blur algorithm
      const tempData = new Uint8ClampedArray(data);
      const blurRadius = 5;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          let rSum = 0,
            gSum = 0,
            bSum = 0;
          let count = 0;

          // Apply blur kernel
          for (let ky = -blurRadius; ky <= blurRadius; ky++) {
            for (let kx = -blurRadius; kx <= blurRadius; kx++) {
              const px = x + kx;
              const py = y + ky;

              if (px >= 0 && px < width && py >= 0 && py < height) {
                const index = (py * width + px) * 4;
                rSum += tempData[index];
                gSum += tempData[index + 1];
                bSum += tempData[index + 2];
                count++;
              }
            }
          }

          // Set the output pixel
          const outIndex = (y * width + x) * 4;
          data[outIndex] = rSum / count;
          data[outIndex + 1] = gSum / count;
          data[outIndex + 2] = bSum / count;
        }
      }
      break;
  }

  return imageData;
}

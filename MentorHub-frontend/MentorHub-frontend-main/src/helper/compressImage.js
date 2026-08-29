/**
 * Resizes and compresses an image file entirely in the browser before upload,
 * so large photos (which would otherwise hit Vercel's serverless request
 * size limit and fail with a 413) stay well under the limit.
 *
 * @param {File} file - the original image file selected by the user
 * @param {number} maxWidth - max width in px the image will be scaled down to
 * @param {number} quality - JPEG quality (0 to 1)
 * @returns {Promise<File>} a new, smaller File object
 */
const compressImage = (file, maxWidth = 800, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Image compression failed"));
            return;
          }
          const compressedFile = new File(
            [blob],
            file.name.replace(/\.[^/.]+$/, "") + ".jpg",
            { type: "image/jpeg" }
          );
          resolve(compressedFile);
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not load image for compression"));
    };

    img.src = objectUrl;
  });
};

export default compressImage;

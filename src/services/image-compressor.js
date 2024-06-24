const sharp = require("sharp");

const DEFAULT_MAX_SIZE = 2000 * 1024; // 2 MB

class ImageCompressor {
  async resize(files = [], maxSize = DEFAULT_MAX_SIZE) {
    return Promise.all(
      files.map(async (file) => {
        const outputBuffer = await sharp(file.buffer)
          .metadata()
          .then((meta) => {
            const quality = (maxSize * 100) / file.size;
            const newWidth = Math.floor((meta.width * quality) / 100);
            const newHeight = Math.floor((meta.height * quality) / 100);
            return sharp(file.buffer).resize(newWidth, newHeight).jpeg().toBuffer();
          });
        return {
          buffer: outputBuffer,
          originalFile: file,
        };
      })
    );
  }
}

module.exports = { ImageCompressor };

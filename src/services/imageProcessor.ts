import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { config } from '../config/config';
import { ProcessedImage } from '../types/types';

export class ImageProcessor {
  async processImage(
    imageBuffer: Buffer,
    imageId: string
  ): Promise<ProcessedImage> {
    const outputFilename = `${imageId}.png`;
    const outputPath = path.join(config.processing.outputDir, outputFilename);

    try {
      await fs.access(outputPath);
      console.log(`Image ${imageId} already processed, skipping.`);
      return {
        id: imageId,
        filename: outputFilename,
        processedPath: outputPath,
      };
    } catch (_e) {}

    await fs.mkdir(config.processing.outputDir, { recursive: true });

    await sharp(imageBuffer)
      .rotate(90)
      .resize(config.processing.outputWidth, config.processing.outputHeight)
      .grayscale()
      .modulate({
        brightness: 1.3,
        saturation: 1.5,
      })
      .png()
      .toFile(outputPath);

    return {
      id: imageId,
      filename: outputFilename,
      processedPath: outputPath,
    };
  }
}

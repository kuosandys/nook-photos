import fs from 'fs/promises';
import path from 'path';
import { config } from '../config/config';
import { LastDisplayedImage } from '../types/types';

export class ImageRotator {
  private lastDisplayedImage: LastDisplayedImage | null = null;

  async initialize() {
    try {
      const data = await fs.readFile(config.storage.lastImageFile, 'utf-8');
      this.lastDisplayedImage = JSON.parse(data);
    } catch {
      this.lastDisplayedImage = null;
    }
  }

  async getNextImage(processedImages: string[]): Promise<string> {
    if (processedImages.length === 0) {
      throw new Error('No processed images available');
    }

    let nextIndex = 0;
    if (this.lastDisplayedImage) {
      const currentIndex = processedImages.indexOf(this.lastDisplayedImage.id);
      nextIndex = (currentIndex + 1) % processedImages.length;
    }

    const nextImageId = processedImages[nextIndex];

    this.lastDisplayedImage = {
      id: nextImageId,
      displayedAt: new Date(),
    };

    await fs.mkdir(path.dirname(config.storage.lastImageFile), {
      recursive: true,
    });
    await fs.writeFile(
      config.storage.lastImageFile,
      JSON.stringify(this.lastDisplayedImage),
      'utf-8'
    );

    return nextImageId;
  }
}

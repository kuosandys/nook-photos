import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { config } from './config/config';
import { GoogleDriveService } from './services/googleDrive';
import { ImageProcessor } from './services/imageProcessor';
import { ImageRotator } from './services/imageRotator';

const app = express();
const googleDrive = new GoogleDriveService();
const imageProcessor = new ImageProcessor();
const imageRotator = new ImageRotator();

async function initializeApp() {
  try {
    await imageRotator.initialize();

    const imageFiles = await googleDrive.getFiles();
    for (const file of imageFiles) {
      const fileId = file.id;
      if (!fileId) continue;
      await imageProcessor.processImage(
        await googleDrive.downloadFile(fileId),
        fileId
      );
    }
  } catch (error) {
    console.error('Error processing images:', error);
    process.exit(1);
  }
}

app.get('/image', async (req, res) => {
  console.log('Serving image');
  try {
    const processedImages = await fs.readdir(config.processing.outputDir);
    const nextImageId = await imageRotator.getNextImage(
      processedImages.map((filename) => path.parse(filename).name)
    );
    const imagePath = path.join(
      config.processing.outputDir,
      `${nextImageId}.png`
    );
    res.sendFile(imagePath);
  } catch (error) {
    console.error('Error serving image:', error);
    res.status(500).send('Error serving image');
  }
});

const startServer = async () => {
  try {
    await initializeApp();
    app.listen(config.server.port, () => {
      console.log(`Server running on port ${config.server.port}`);
    });
  } catch (error) {
    console.error('Failed to initialize app:', error);
    process.exit(1);
  }
};

startServer();

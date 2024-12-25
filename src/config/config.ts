import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
  google: {
    serviceAccountKeyPath: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH!,
    folderId: process.env.GOOGLE_FOLDER_ID!,
  },
  processing: {
    outputWidth: 600,
    outputHeight: 800,
    outputDir: path.join(__dirname, '../../data/processed-images'),
  },
  server: {
    port: parseInt(process.env.PORT || '3000'),
  },
  storage: {
    lastImageFile: path.join(__dirname, '../../data/last-image.json'),
  },
};

const requiredEnvVars = ['GOOGLE_SERVICE_ACCOUNT_KEY_PATH', 'GOOGLE_FOLDER_ID'];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required env var: ${envVar}`);
  }
});

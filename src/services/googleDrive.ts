import { drive_v3, google } from 'googleapis';
import { config } from '../config/config';

export class GoogleDriveService {
  private googleDrive: drive_v3.Drive;

  constructor() {
    const auth = new google.auth.GoogleAuth({
      keyFile: config.google.serviceAccountKeyPath,
      scopes: ['https://www.googleapis.com/auth/drive'],
    });
    google.options({ auth: auth });
    this.googleDrive = google.drive('v3');
  }

  async getFiles() {
    try {
      const response = await this.googleDrive.files.list({
        q: `'${config.google.folderId}' in parents`,
        fields: 'files(id)',
      });

      return response.data.files || [];
    } catch (error) {
      console.error('Error fetching files from Drive:', error);
      throw error;
    }
  }

  async downloadFile(fileId: string): Promise<Buffer> {
    try {
      const response = await this.googleDrive.files.get(
        {
          fileId,
          alt: 'media',
        },
        { responseType: 'stream' }
      );

      return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        response.data
          .on('data', (chunk: Buffer) => chunks.push(chunk))
          .on('end', () => resolve(Buffer.concat(chunks)))
          .on('error', reject);
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }
}

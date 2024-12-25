export interface ProcessedImage {
  id: string;
  filename: string;
  processedPath: string;
}

export interface LastDisplayedImage {
  id: string;
  displayedAt: Date;
}

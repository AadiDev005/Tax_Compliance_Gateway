export interface ProcessingDocument {
  id: string;
  filename: string;
  format: string;
  size: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  uploadDate?: string;
  uploadTime?: string;
}

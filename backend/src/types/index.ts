export interface FileMetadata {
  id: string;
  filename: string;
  originalName: string;
  path: string;
  size: number;
  mimetype: string;
  status: 'pending' | 'scanned';
  result: 'clean' | 'infected' | null;
  uploadedAt: Date;
  scannedAt: Date | null;
  hash?: string;
}

export interface ScanJob {
  id: string;
  fileId: string;
  filePath: string;
  priority?: number;
  createdAt: Date;
}

export interface ScanResult {
  fileId: string;
  result: 'clean' | 'infected';
  scannedAt: Date;
  details?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UploadProgress {
  fileId: string;
  progress: number;
  status: string;
}
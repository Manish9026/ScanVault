export interface FileMetadata {
  id: string;
  filename: string;
  originalName: string;
  path: string;
  size: number;
  mimetype: string;
  status: 'pending' | 'scanned';
  result: 'clean' | 'infected' | null;
  uploadedAt: string;
  scannedAt: string | null;
  hash?: string;
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

export interface Stats {
  total: number;
  pending: number;
  clean: number;
  infected: number;
  scanned: number;
}
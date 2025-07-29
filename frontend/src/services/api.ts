import axios from 'axios';
import { FileMetadata, ApiResponse, Stats } from '../types';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use((config) => {
  console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const uploadAPI = {
  uploadFiles: async (files: FileList, onProgress?: (progress: number) => void): Promise<FileMetadata[]> => {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });

    const response = await api.post<ApiResponse<FileMetadata[]>>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const progress = progressEvent.total 
          ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
          : 0;
        onProgress?.(progress);
      }
    });

    if (!response.data.success) {
      throw new Error(response.data.error || 'Upload failed');
    }

    return response.data.data || [];
  },

  getFiles: async (status?: string): Promise<FileMetadata[]> => {
    const params = status ? { status } : {};
    const response = await api.get<ApiResponse<FileMetadata[]>>('/upload', { params });
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch files');
    }

    return response.data.data || [];
  },

  getFile: async (id: string): Promise<FileMetadata> => {
    const response = await api.get<ApiResponse<FileMetadata>>(`/upload/${id}`);
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch file');
    }

    if (!response.data.data) {
      throw new Error('File not found');
    }

    return response.data.data;
  },

  getStats: async (): Promise<Stats> => {
    const response = await api.get<ApiResponse<Stats>>('/upload/stats/overview');
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch stats');
    }

    return response.data.data || { total: 0, pending: 0, clean: 0, infected: 0, scanned: 0 };
  }
};

export default api;
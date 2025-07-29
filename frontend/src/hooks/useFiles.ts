import { useState, useEffect, useCallback } from 'react';
import { FileMetadata } from '../types';
import { uploadAPI } from '../services/api';
import toast from 'react-hot-toast';

export const useFiles = (autoRefresh = false, refreshInterval = 5000) => {
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = useCallback(async (status?: string) => {
    try {
      setLoading(true);
      setError(null);
      const fetchedFiles = await uploadAPI.getFiles(status);
      setFiles(fetchedFiles);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch files';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshFiles = useCallback(() => {
    fetchFiles();
  }, [fetchFiles]);

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchFiles();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchFiles]);

  // Initial load
  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  return {
    files,
    loading,
    error,
    fetchFiles,
    refreshFiles
  };
};
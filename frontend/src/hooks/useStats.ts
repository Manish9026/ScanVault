import { useState, useEffect, useCallback } from 'react';
import { Stats } from '../types';
import { uploadAPI } from '../services/api';

export const useStats = (autoRefresh = false, refreshInterval = 10000) => {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    clean: 0,
    infected: 0,
    scanned: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setError(null);
      const fetchedStats = await uploadAPI.getStats();
      setStats(fetchedStats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stats';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchStats();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchStats]);

  // Initial load
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    fetchStats
  };
};
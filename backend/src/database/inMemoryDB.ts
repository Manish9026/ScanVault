import { FileMetadata } from '../types/index.js';
import logger from '../utils/logger.js';

class InMemoryDatabase {
  private files: Map<string, FileMetadata> = new Map();
  private cache: Map<string, any> = new Map();

  async saveFile(file: FileMetadata): Promise<FileMetadata> {
    this.files.set(file.id, file);
    logger.info(`File saved to database: ${file.id}`);
    return file;
  }

  async getFile(id: string): Promise<FileMetadata | null> {
    return this.files.get(id) || null;
  }

  async getAllFiles(): Promise<FileMetadata[]> {
    return Array.from(this.files.values()).sort((a, b) => 
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
  }

  async getFilesByStatus(status: FileMetadata['status']): Promise<FileMetadata[]> {
    return Array.from(this.files.values())
      .filter(file => file.status === status)
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  }

  async updateFile(id: string, updates: Partial<FileMetadata>): Promise<FileMetadata | null> {
    const file = this.files.get(id);
    if (!file) return null;

    const updatedFile = { ...file, ...updates };
    this.files.set(id, updatedFile);
    logger.info(`File updated in database: ${id}`);
    return updatedFile;
  }

  async getFileByHash(hash: string): Promise<FileMetadata | null> {
    for (const file of this.files.values()) {
      if (file.hash === hash) {
        return file;
      }
    }
    return null;
  }

  // Redis-like cache operations
  async cacheSet(key: string, value: any, ttlSeconds?: number): Promise<void> {
    this.cache.set(key, { value, expiresAt: ttlSeconds ? Date.now() + (ttlSeconds * 1000) : null });
  }

  async cacheGet(key: string): Promise<any> {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (cached.expiresAt && Date.now() > cached.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.value;
  }

  async cacheDelete(key: string): Promise<boolean> {
    return this.cache.delete(key);
  }

  // Statistics
  async getStats() {
    const files = Array.from(this.files.values());
    return {
      total: files.length,
      pending: files.filter(f => f.status === 'pending').length,
      clean: files.filter(f => f.result === 'clean').length,
      infected: files.filter(f => f.result === 'infected').length,
      scanned: files.filter(f => f.status === 'scanned').length
    };
  }
}

export const db = new InMemoryDatabase();
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FileMetadata, ScanJob } from '../types/index.js';
import { db } from '../database/inMemoryDB.js';
import { queue } from '../queue/inMemoryQueue.js';
import { generateFileHash, generateUniqueFilename } from '../utils/fileUtils.js';
import logger from '../utils/logger.js';
import { config } from '../config/index.js';

export class UploadService {
  async processUpload(file: Express.Multer.File): Promise<FileMetadata> {
    try {
      // Generate file hash for deduplication
      const fileHash = await generateFileHash(file.path);
      
      // Check for duplicate
      const existingFile = await db.getFileByHash(fileHash);
      if (existingFile) {
        logger.info(`Duplicate file detected: ${file.originalname} (${fileHash})`);
        return existingFile;
      }

      // Create file metadata
      const fileId = uuidv4();
      const fileMetadata: FileMetadata = {
        id: fileId,
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        size: file.size,
        mimetype: file.mimetype,
        status: 'pending',
        result: null,
        uploadedAt: new Date(),
        scannedAt: null,
        hash: fileHash
      };

      // Save to database
      await db.saveFile(fileMetadata);

      // Queue scan job
      const scanJob: ScanJob = {
        id: uuidv4(),
        fileId: fileId,
        filePath: file.path,
        priority: 1,
        createdAt: new Date()
      };

      await queue.publish(scanJob);

      logger.info(`File uploaded and queued for scanning: ${file.originalname} (${fileId})`);
      return fileMetadata;

    } catch (error) {
      logger.error('Upload processing failed:', error);
      throw new Error('Failed to process upload');
    }
  }

  async getFiles(status?: string): Promise<FileMetadata[]> {
    try {
      if (status && ['pending', 'scanned'].includes(status)) {
        return await db.getFilesByStatus(status as FileMetadata['status']);
      }
      return await db.getAllFiles();
    } catch (error) {
      logger.error('Failed to retrieve files:', error);
      throw new Error('Failed to retrieve files');
    }
  }

  async getFile(id: string): Promise<FileMetadata | null> {
    try {
      return await db.getFile(id);
    } catch (error) {
      logger.error(`Failed to retrieve file ${id}:`, error);
      throw new Error('Failed to retrieve file');
    }
  }

  async getUploadStats() {
    return await db.getStats();
  }

  validateFile(file: Express.Multer.File): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > config.maxFileSize) {
      return {
        valid: false,
        error: `File size exceeds limit of ${config.maxFileSize / 1024 / 1024}MB`
      };
    }

    // Check file extension
    const ext = path.extname(file.originalname).toLowerCase();
    if (!config.allowedFileTypes.includes(ext)) {
      return {
        valid: false,
        error: `File type ${ext} not allowed. Allowed types: ${config.allowedFileTypes.join(', ')}`
      };
    }

    // Check MIME type
    if (!config.allowedMimeTypes.includes(file.mimetype)) {
      return {
        valid: false,
        error: `MIME type ${file.mimetype} not allowed`
      };
    }

    return { valid: true };
  }
}

export const uploadService = new UploadService();
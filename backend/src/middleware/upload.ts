import multer from 'multer';
import path from 'path';
import { config } from '../config/index.js';
import { generateUniqueFilename, ensureDirectoryExists } from '../utils/fileUtils.js';
import logger from '../utils/logger.js';

// Ensure upload directory exists
await ensureDirectoryExists(config.uploadDir);

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      await ensureDirectoryExists(config.uploadDir);
      cb(null, config.uploadDir);
    } catch (error) {
      logger.error('Failed to create upload directory:', error);
      cb(error as Error, '');
    }
  },
  filename: (req, file, cb) => {
    const uniqueFilename = generateUniqueFilename(file.originalname);
    cb(null, uniqueFilename);
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (config.allowedFileTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${ext} not allowed. Allowed types: ${config.allowedFileTypes.join(', ')}`));
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: config.maxFileSize,
    files: 5 // Max 5 files per request
  },
  fileFilter
});
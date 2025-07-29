import { Request, Response } from 'express';
import { ApiResponse, FileMetadata } from '../types/index.js';
import { uploadService } from '../services/uploadService.js';
import logger from '../utils/logger.js';

export class UploadController {
  async uploadFiles(req: Request, res: Response<ApiResponse<FileMetadata[]>>) {
    try {
      const files = req.files as Express.Multer.File[];

      
      
      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No files provided'
        });
      }

      const processedFiles: FileMetadata[] = [];
      const errors: string[] = [];

      for (const file of files) {
        try {
          // Validate file
          const validation = uploadService.validateFile(file);
          if (!validation.valid) {
            errors.push(`${file.originalname}: ${validation.error}`);
            continue;
          }

          // Process upload
          const fileMetadata = await uploadService.processUpload(file);
          processedFiles.push(fileMetadata);

        } catch (error) {
          logger.error(`Failed to process file ${file.originalname}:`, error);
          errors.push(`${file.originalname}: Processing failed`);
        }
      }

      if (processedFiles.length === 0 && errors.length > 0) {
        return res.status(400).json({
          success: false,
          error: `Failed to process files: ${errors.join(', ')}`
        });
      }

      const response: ApiResponse<FileMetadata[]> = {
        success: true,
        data: processedFiles,
        message: `Successfully uploaded ${processedFiles.length} file(s)`
      };

      if (errors.length > 0) {
        response.message += `. Errors: ${errors.join(', ')}`;
      }

      res.status(201).json(response);

    } catch (error) {
      console.log(error);
      
      logger.error('Upload controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to upload files'
      });
    }
  }

  async getFiles(req: Request, res: Response<ApiResponse<FileMetadata[]>>) {
    try {
      const { status } = req.query;
      const files = await uploadService.getFiles(status as string);

      res.json({
        success: true,
        data: files
      });

    } catch (error) {
      logger.error('Get files controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve files'
      });
    }
  }

  async getFile(req: Request, res: Response<ApiResponse<FileMetadata>>) {
    try {
      const { id } = req.params;
      const file = await uploadService.getFile(id);

      if (!file) {
        return res.status(404).json({
          success: false,
          error: 'File not found'
        });
      }

      res.json({
        success: true,
        data: file
      });

    } catch (error) {
      logger.error('Get file controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve file'
      });
    }
  }

  async getStats(req: Request, res: Response<ApiResponse>) {
    try {
      const stats = await uploadService.getUploadStats();
      
      res.json({
        success: true,
        data: stats
      });

    } catch (error) {
      logger.error('Get stats controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve statistics'
      });
    }
  }
}

export const uploadController = new UploadController();
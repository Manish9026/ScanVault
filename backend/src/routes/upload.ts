import { Router } from 'express';
import { uploadController } from '../controllers/uploadController.js';
import { upload } from '../middleware/upload.js';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting for uploads
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 uploads per windowMs
  message: {
    success: false,
    error: 'Too many upload attempts, please try again later'
  }
});

// Upload files
router.post('/', uploadLimiter, upload.array('files', 5), uploadController.uploadFiles);

// Get all files
router.get('/', uploadController.getFiles);

// Get specific file
router.get('/:id', uploadController.getFile);

// Get upload statistics
router.get('/stats/overview', uploadController.getStats);

export default router;
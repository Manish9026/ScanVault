import { queue } from '../queue/inMemoryQueue.js';
import { scannerService } from '../services/scannerService.js';
import logger from '../utils/logger.js';

export class ScanWorker {
  start() {
    logger.info('Starting scan worker...');
    
    queue.subscribe(async (job) => {
      try {
        logger.info(`Worker processing scan job: ${job.id}`);
        await scannerService.scanFile(job);
        logger.info(`Worker completed scan job: ${job.id}`);
      } catch (error) {
        logger.error(`Worker failed to process job ${job.id}:`, error);
      }
    });

    logger.info('Scan worker started successfully');
  }

  getStatus() {
    return {
      active: true,
      queueStats: queue.getQueueStats()
    };
  }
}

export const scanWorker = new ScanWorker();
import { ScanJob } from '../types/index.js';
import logger from '../utils/logger.js';

class InMemoryQueue {
  private queue: ScanJob[] = [];
  private processing = false;
  private consumers: ((job: ScanJob) => Promise<void>)[] = [];

  async publish(job: ScanJob): Promise<void> {
    this.queue.push(job);
    logger.info(`Job queued: ${job.id} for file ${job.fileId}`);
    
    // Start processing if not already running
    if (!this.processing) {
      this.processQueue();
    }
  }

  subscribe(consumer: (job: ScanJob) => Promise<void>): void {
    this.consumers.push(consumer);
    logger.info('Consumer subscribed to queue');
  }

  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    
    while (this.queue.length > 0) {
      const job = this.queue.shift();
      if (!job) continue;

      logger.info(`Processing job: ${job.id}`);
      
      // Process with all consumers
      const promises = this.consumers.map(consumer => 
        consumer(job).catch(error => {
          logger.error(`Consumer error processing job ${job.id}:`, error);
        })
      );
      
      await Promise.all(promises);
    }
    
    this.processing = false;
  }

  getQueueLength(): number {
    return this.queue.length;
  }

  getQueueStats() {
    return {
      pending: this.queue.length,
      processing: this.processing,
      consumers: this.consumers.length
    };
  }
}

export const queue = new InMemoryQueue();
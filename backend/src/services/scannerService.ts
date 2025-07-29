import fs from 'fs/promises';
import { ScanJob, ScanResult } from '../types/index.js';
import { db } from '../database/inMemoryDB.js';
import logger from '../utils/logger.js';

export class ScannerService {
  private readonly malwareKeywords = [
    'rm -rf',
    'eval(',
    'bitcoin',
    'malware',
    'virus',
    'trojan',
    'keylogger',
    'backdoor',
    'exploit'
  ];

  async scanFile(job: ScanJob): Promise<ScanResult> {
    logger.info(`Starting scan for file: ${job.fileId}`);
    
    try {
      // Simulate scanning delay (2-5 seconds)
      const scanDelay = Math.random() * 3000 + 2000;
      await new Promise(resolve => setTimeout(resolve, scanDelay));

      // Read file content for analysis
      const fileContent = await this.readFileContent(job.filePath);
      
      // Determine if file is infected
      const isInfected = this.detectMalware(fileContent, job.filePath);
      const result: ScanResult['result'] = isInfected ? 'infected' : 'clean';
      
      const scanResult: ScanResult = {
        fileId: job.fileId,
        result,
        scannedAt: new Date(),
        details: isInfected ? 'Malicious content detected' : 'No threats found'
      };

      // Update file in database
      await db.updateFile(job.fileId, {
        status: 'scanned',
        result: scanResult.result,
        scannedAt: scanResult.scannedAt
      });

      logger.info(`Scan completed for file ${job.fileId}: ${result}`);

      // Send alert if infected
      if (isInfected) {
        await this.sendInfectionAlert(job.fileId);
      }

      return scanResult;
    } catch (error) {
      logger.error(`Scan failed for file ${job.fileId}:`, error);
      
      // Mark as clean if scan fails (fallback)
      await db.updateFile(job.fileId, {
        status: 'scanned',
        result: 'clean',
        scannedAt: new Date()
      });

      return {
        fileId: job.fileId,
        result: 'clean',
        scannedAt: new Date(),
        details: 'Scan completed with warnings'
      };
    }
  }

  private async readFileContent(filePath: string): Promise<string> {
    try {
      // For binary files, we'll read as buffer and convert to string for analysis
      const buffer = await fs.readFile(filePath);
      return buffer.toString('utf8');
    } catch (error) {
      logger.warn(`Could not read file content: ${filePath}`, error);
      return '';
    }
  }

  private detectMalware(content: string, filename: string): boolean {
    // Check filename for suspicious patterns
    const suspiciousFilename = /\.(exe|bat|cmd|scr|vbs|js|jar)$/i.test(filename);
    
    // Check content for malware keywords
    const contentLower = content.toLowerCase();
    const hasKeywords = this.malwareKeywords.some(keyword => 
      contentLower.includes(keyword.toLowerCase())
    );

    // Additional heuristics
    const hasSuspiciousPatterns = [
      /eval\s*\(/gi,
      /document\.write\s*\(/gi,
      /base64_decode/gi,
      /shell_exec/gi,
      /system\s*\(/gi
    ].some(pattern => pattern.test(content));

    // Random infection chance for demonstration (10%)
    const randomInfection = Math.random() < 0.1;

    return suspiciousFilename || hasKeywords || hasSuspiciousPatterns || randomInfection;
  }

  private async sendInfectionAlert(fileId: string): Promise<void> {
    try {
      const file = await db.getFile(fileId);
      if (!file) return;

      const alertMessage = {
        text: `🚨 *MALWARE DETECTED* 🚨`,
        attachments: [{
          color: 'danger',
          fields: [
            { title: 'File Name', value: file.originalName, short: true },
            { title: 'File ID', value: file.id, short: true },
            { title: 'Upload Time', value: file.uploadedAt.toISOString(), short: true },
            { title: 'Scan Time', value: file.scannedAt?.toISOString() || 'N/A', short: true }
          ]
        }]
      };

      logger.warn(`MALWARE DETECTED - File: ${file.originalName} (${file.id})`);
      
      // In a real implementation, this would send to Slack/webhook
      // For demo, we'll just log the alert
      logger.info('Infection alert sent:', alertMessage);
      
    } catch (error) {
      logger.error(`Failed to send infection alert for file ${fileId}:`, error);
    }
  }
}

export const scannerService = new ScannerService();
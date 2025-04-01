import * as fs from 'fs';
import * as path from 'path';

export class Logger {
  private static logDir = 'test-results/logs';
  private static logFile: string;
  private static timestamp: string;

  static initialize(): void {
    // Create timestamp for this test run
    this.timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Create log directory if it doesn't exist
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }

    // Set log file path
    this.logFile = path.join(this.logDir, `test-run-${this.timestamp}.log`);
    
    // Create initial log entry
    this.info('🚀 Test run started');
  }

  private static writeToFile(message: string): void {
    if (!this.logFile) {
      this.initialize();
    }
    fs.appendFileSync(this.logFile, `${new Date().toISOString()} ${message}\n`);
  }

  static info(message: string, data?: any): void {
    const logMessage = data ? `${message} ${JSON.stringify(data)}` : message;
    console.log(logMessage);
    this.writeToFile(`[INFO] ${logMessage}`);
  }

  static error(message: string, error?: any): void {
    const errorDetails = error ? `${message}\nDetails: ${JSON.stringify(error, null, 2)}` : message;
    console.error(`❌ ${errorDetails}`);
    this.writeToFile(`[ERROR] ${errorDetails}`);
  }

  static success(message: string): void {
    console.log(`✅ ${message}`);
    this.writeToFile(`[SUCCESS] ${message}`);
  }

  static warning(message: string): void {
    console.warn(`⚠️ ${message}`);
    this.writeToFile(`[WARNING] ${message}`);
  }

  static step(message: string): void {
    console.log(`🔄 ${message}`);
    this.writeToFile(`[STEP] ${message}`);
  }

  static screenshot(path: string, reason: string): void {
    this.info(`📸 Screenshot taken: ${path}`, { reason });
  }
} 
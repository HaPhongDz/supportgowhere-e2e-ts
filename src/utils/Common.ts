import { Page } from 'playwright/test';
import { Logger } from './Logger';

export class Common {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Handle errors with screenshot and logging
   * @param error The error object
   * @param context Description of what was being attempted
   * @param screenshotName Name for the screenshot file
   */
  async handleError(error: any, context: string, screenshotName: string): Promise<void> {
    Logger.error(`Failed to ${context}`, error);
    
    // Take screenshot
    const screenshotPath = `${screenshotName}-${Date.now()}.png`;
    await this.page.screenshot({ path: screenshotPath });
    Logger.screenshot(screenshotPath, `Error during ${context}`);
  }

  /**
   * Click on an element with a delay before and after
   * @param selector The element selector
   * @param delayBeforeMs Delay before clicking (default: 500ms)
   * @param delayAfterMs Delay after clicking (default: 1000ms)
   */
  async clickWithDelay(
    selector: string, 
    delayBeforeMs: number = 500, 
    delayAfterMs: number = 1000
  ): Promise<void> {
    try {
      // Wait before clicking
      await this.page.waitForTimeout(delayBeforeMs);
      
      // Wait for element to be visible and clickable
      await this.page.waitForSelector(selector, { 
        state: 'visible', 
        timeout: 10000 
      });
      
      // Click the element
      await this.page.click(selector);
      
      // Wait after clicking
      await this.page.waitForTimeout(delayAfterMs);
    } catch (error) {
      await this.handleError(error, `click on element ${selector}`, 'error-click');
      throw new Error(`Failed to click on element: ${selector}`);
    }
  }

  /**
   * Wait for an element to be visible
   * @param selector The element selector
   * @param timeoutMs Maximum time to wait (default: 10000ms)
   */
  async waitForVisible(selector: string, timeoutMs: number = 10000): Promise<void> {
    try {
      await this.page.waitForSelector(selector, { 
        state: 'visible', 
        timeout: timeoutMs 
      });
    } catch (error) {
      await this.handleError(error, `wait for element ${selector} to be visible`, 'error-wait-visible');
      throw new Error(`Element not visible after ${timeoutMs}ms: ${selector}`);
    }
  }

  /**
   * Get text content of an element
   * @param selector The element selector
   * @param timeoutMs Maximum time to wait (default: 5000ms)
   */
  async getTextContent(selector: string, timeoutMs: number = 5000): Promise<string | null> {
    try {
      await this.waitForVisible(selector, timeoutMs);
      const text = await this.page.textContent(selector);
      return text?.trim() || null;
    } catch (error) {
      await this.handleError(error, `get text content of element ${selector}`, 'error-get-text');
      return null;
    }
  }
} 
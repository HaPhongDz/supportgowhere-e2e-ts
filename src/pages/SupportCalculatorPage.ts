// pages/SupportCalculatorPage.ts
import { Page } from 'playwright/test';
import supportCalculatorPageLocators from '../locators/supportCalculatorPageLocators';

export default class SupportCalculatorPage {
  readonly page: Page;
  readonly startButton: string;

  constructor(page: Page) {
    this.page = page;
    this.startButton = supportCalculatorPageLocators.startButton;
  }

  async clickStart(): Promise<void> {
    await this.page.click(this.startButton);
  }
}

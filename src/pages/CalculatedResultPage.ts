// pages/CalculatedResultPage.ts
import { Page } from 'playwright/test';
import calculatedResultPageLocators from '../locators/calculatedResultPageLocators';

export default class CalculatedResultPage {
  readonly page: Page;
  readonly resultContainer: string;

  constructor(page: Page) {
    this.page = page;
    this.resultContainer = calculatedResultPageLocators.resultContainer;
  }

  async getResultText(): Promise<string | null> {
    return await this.page.textContent(this.resultContainer);
  }
}

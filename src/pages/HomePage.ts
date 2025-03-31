// pages/HomePage.ts
import { Page } from 'playwright/test';
import homePageLocators from '../locators/homePageLocators';

export default class HomePage {
  readonly page: Page;
  readonly calculatorButton: string;

  constructor(page: Page) {
    this.page = page;
    this.calculatorButton = homePageLocators.calculatorButton;
  }

  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async clickCalculator(): Promise<void> {
    await this.page.click(this.calculatorButton);
  }
}

// pages/CalculatedResultPage.ts
import { Page } from 'playwright/test';
import calculatedResultPageLocators from '../locators/calculatedResultPageLocators';
import { Logger } from '../utils/Logger';
import { Common } from '../utils/Common';

export default class CalculatedResultPage {
  readonly page: Page;
  private common: Common;

  constructor(page: Page) {
    this.page = page;
    this.common = new Common(page);
  }

  async clickYearTab(year: string): Promise<void> {
    Logger.step(`Clicking on tab for year: ${year}`);
    
    const tabSelector = calculatedResultPageLocators.yearTab(year);
    
    try {
      await this.common.waitForVisible(tabSelector);
      await this.common.clickWithDelay(tabSelector);
      Logger.success(`Successfully clicked on tab for year: ${year}`);
    } catch (error) {
      await this.common.handleError(error, `click on tab for year ${year}`, 'error-tab-click');
      throw new Error(`Tab for year ${year} not found or not clickable`);
    }
  }
  
  async getAmountForPackage(packageName: string): Promise<string | null> {
    Logger.step(`Getting amount for package: ${packageName}`);
    
    if (!packageName.includes('Assurance Package')) {
      Logger.error(`Only Assurance Package is supported, received: ${packageName}`);
      return null;
    }

    const year = packageName.replace('Assurance Package ', '');
    const amountSelector = calculatedResultPageLocators.assurancePackageAmount(year);
    
    try {
      const amountText = await this.common.getTextContent(amountSelector);
      Logger.success(`Found amount for ${packageName}: ${amountText}`);
      return amountText;
    } catch (error) {
      await this.common.handleError(error, `find amount for package ${packageName}`, 'error-amount');
      return null;
    }
  }
}

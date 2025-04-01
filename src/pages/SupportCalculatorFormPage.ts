// pages/SupportCalculatorFormPage.ts
import { Page } from '@playwright/test';
import SupportCalculatorFormPageLocators from '../locators/supportCalculatorFormPageLocators';
import { Logger } from '../utils/Logger';

// Custom error class for form filling errors
class FormError extends Error {
  constructor(
    message: string,
    public readonly field?: string,
    public readonly value?: string,
    public readonly screenshot?: string
  ) {
    super(message);
    this.name = 'FormError';
  }
}

interface FormData {
  birthYear?: string;
  income?: string;
  nsStatus?: string;
  cpf?: string;
  propertyOwnership?: string;
  housingType?: string;
  av?: string;
}

export default class SupportCalculatorFormPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private async handleError(error: any, field: string, value?: string): Promise<never> {
    Logger.error(`Error in ${field}:`, error.message);
    
    // Take screenshot
    const screenshotPath = `error-${field}-${Date.now()}.png`;
    await this.page.screenshot({ path: screenshotPath });
    Logger.screenshot(screenshotPath, `Error in ${field}`);
    
    // Create custom error with details
    throw new FormError(
      `Failed to handle ${field}: ${error.message}`,
      field,
      value,
      screenshotPath
    );
  }

  // Enhanced click method with automatic delay
  private async clickWithDelay(selector: string, delayMs = 2000): Promise<void> {
    await this.page.locator(selector).click();
    Logger.info(`Clicked on ${selector}, waiting ${delayMs}ms...`);
    await this.page.waitForTimeout(delayMs);
  }

  // Retry mechanism for waitForVisible
  private async waitForVisible(selector: string, options: { timeout?: number, retries?: number, retryInterval?: number } = {}): Promise<void> {
    const { 
      timeout = 10000, 
      retries = 3, 
      retryInterval = 1000 
    } = options;
    
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await this.page.locator(selector).waitFor({ 
          state: 'visible',
          timeout: Math.floor(timeout / retries)
        });
        Logger.success(`Element found and visible: ${selector} (attempt ${attempt}/${retries})`);
        return; // Success, exit function
      } catch (error: any) {
        lastError = error;
        if (attempt < retries) {
          Logger.warning(`Element not visible: ${selector}, retrying... (${attempt}/${retries})`);
          await this.page.waitForTimeout(retryInterval);
        }
      }
    }
    
    // If we got here, all retries failed
    Logger.error(`Element not visible after ${retries} attempts: ${selector}`);
    if (lastError) {
      await this.handleError(lastError, 'element visibility', selector);
    }
  }

  private async selectOption(dropdownSelector: string, optionValue: string, field: string): Promise<void> {
    try {
      Logger.step(`Attempting to select ${optionValue} for ${field}`);
      
      // Wait for and click dropdown with delay
      await this.waitForVisible(dropdownSelector, { retries: 3 });
      await this.clickWithDelay(dropdownSelector);
      
      // Wait for and select option with delay
      const optionSelector = SupportCalculatorFormPageLocators.getDropdownOption(optionValue);
      await this.waitForVisible(optionSelector, { retries: 3 });
      await this.clickWithDelay(optionSelector);

      Logger.success(`Successfully selected ${optionValue} for ${field}`);
    } catch (error: any) {
      await this.handleError(error, field, optionValue);
    }
  }

  private async fillYearOfBirth(value: string): Promise<void> {
    try {
      Logger.step('Filling Year of Birth...');
      await this.selectOption(
        SupportCalculatorFormPageLocators.yearOfBirthDropdown, 
        value,
        'Year of Birth'
      );
      //await this.waitForVisible(SupportCalculatorFormPageLocators.assessableIncomeDropdown, { retries: 3 });
      Logger.success('Year of Birth filled successfully');
    } catch (error: any) {
      await this.handleError(error, 'Year of Birth', value);
    }
  }

  private async fillAssessableIncome(value: string): Promise<void> {
    try {
      Logger.step('Filling Assessable Income...');
      await this.selectOption(
        SupportCalculatorFormPageLocators.assessableIncomeDropdown, 
        value,
        'Assessable Income'
      );
      await this.waitForVisible(SupportCalculatorFormPageLocators.housingTypeDropdown, { retries: 3 });
      Logger.success('Assessable Income filled successfully');
    } catch (error: any) {
      await this.handleError(error, 'Assessable Income', value);
    }
  }

  private async fillHousingType(value: string): Promise<void> {
    try {
      Logger.step('Filling Housing Type...');
      await this.selectOption(
        SupportCalculatorFormPageLocators.housingTypeDropdown, 
        value,
        'Housing Type'
      );
      Logger.success('Housing Type filled successfully');
    } catch (error: any) {
      await this.handleError(error, 'Housing Type', value);
    }
  }

  private async fillPropertyOwnership(value: string): Promise<void> {
    try {
      Logger.step('Filling Property Ownership...');
      await this.selectOption(
        SupportCalculatorFormPageLocators.propertyOwnershipDropdown, 
        value,
        'Property Ownership'
      );
      await this.waitForVisible(SupportCalculatorFormPageLocators.ownsMoreThanOnePropertyYes, { retries: 3 });
      Logger.success('Property Ownership filled successfully');
    } catch (error: any) {
      await this.handleError(error, 'Property Ownership', value);
    }
  }

  private async selectMultipleProperty(value: string): Promise<void> {
    try {
      Logger.step('Selecting Multiple Property option...');
      const selector = value === 'Yes'
        ? SupportCalculatorFormPageLocators.ownsMoreThanOnePropertyYes
        : SupportCalculatorFormPageLocators.ownsMoreThanOnePropertyNo;
      
      await this.waitForVisible(selector, { retries: 3 });
      await this.clickWithDelay(selector);
      Logger.success(`Multiple Property option selected: ${value}`);
    } catch (error: any) {
      await this.handleError(error, 'Multiple Property Selection', value);
    }
  }

  async fillForm(data: { [key: string]: string }): Promise<void> {
    Logger.step('Starting form fill...');

    // Sequential execution - each method already has error handling
    if (data['Year of birth']) {
      await this.fillYearOfBirth(data['Year of birth']);
    }
    
    if (data['Recent Assessable Income (AI)']) {
      await this.fillAssessableIncome(data['Recent Assessable Income (AI)']);
    }
    
    if (data['Housing type']) {
      await this.fillHousingType(data['Housing type']);
    }
    
    if (data['Property ownership']) {
      await this.fillPropertyOwnership(data['Property ownership']);
    }
    
    if (data['Do you own more than 1 property?']) {
      await this.selectMultipleProperty(data['Do you own more than 1 property?']);
    }
    
    Logger.success('Form filled successfully');
  }

  async clickShowBenefits(): Promise<void> {
    try {
      Logger.step('Clicking Show Benefits button...');
      await this.waitForVisible(SupportCalculatorFormPageLocators.showBenefitsButton, { retries: 3 });
      await this.clickWithDelay(SupportCalculatorFormPageLocators.showBenefitsButton);
      Logger.success('Show Benefits button clicked successfully');
    } catch (error: any) {
      await this.handleError(error, 'Show Benefits Button');
    }
  }
}



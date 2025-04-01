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

  private async waitForVisible(selector: string, timeout = 10000): Promise<void> {
    try {
      await this.page.locator(selector).waitFor({ 
        state: 'visible',
        timeout: timeout
      });
      Logger.success(`Element found and visible: ${selector}`);
    } catch (error: any) {
      await this.handleError(error, 'element visibility', selector);
    }
  }

  private async selectOption(dropdownSelector: string, optionValue: string, field: string): Promise<void> {
    try {
      Logger.step(`Attempting to select ${optionValue} for ${field}`);
      
      // Wait for and click dropdown
      await this.waitForVisible(dropdownSelector);
      await this.page.locator(dropdownSelector).click();
      
      // Wait for and select option
      const optionSelector = SupportCalculatorFormPageLocators.getDropdownOption(optionValue);
      await this.waitForVisible(optionSelector);
      await this.page.locator(optionSelector).click();

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
      await this.waitForVisible(SupportCalculatorFormPageLocators.assessableIncomeDropdown);
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
      await this.waitForVisible(SupportCalculatorFormPageLocators.housingTypeDropdown);
      Logger.success('Assessable Income filled successfully');
    } catch (error: any) {
      await this.handleError(error, 'Assessable Income', value);
    }
  }

  private async fillHousingType(value: string): Promise<void> {
    try {
      Logger.step('Filling Housing Type...');
      Logger.info('Waiting for 5 seconds...');
      await this.page.waitForTimeout(5000);
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
      await this.waitForVisible(SupportCalculatorFormPageLocators.ownsMoreThanOnePropertyYes);
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
      
      await this.waitForVisible(selector);
      await this.page.locator(selector).click();
      Logger.success(`Multiple Property option selected: ${value}`);
    } catch (error: any) {
      await this.handleError(error, 'Multiple Property Selection', value);
    }
  }

  async fillForm(data: { [key: string]: string }): Promise<void> {
    try {
      Logger.step('Starting form fill...');
      await this.fillYearOfBirth(data['Year of birth'])
        .then(() => this.fillAssessableIncome(data['Recent Assessable Income (AI)']))
        .then(() => this.fillHousingType(data['Housing type']))
        .then(() => {
          if (data['Property ownership']) {
            return this.fillPropertyOwnership(data['Property ownership']);
          }
        })
        .then(() => {
          if (data['Do you own more than 1 property?']) {
            return this.selectMultipleProperty(data['Do you own more than 1 property?']);
          }
        })
        .then(() => {
          Logger.success('Form filled successfully');
        });
    } catch (error: any) {
      if (error instanceof FormError) {
        Logger.error('Form filling failed:', {
          field: error.field,
          value: error.value,
          message: error.message,
          screenshot: error.screenshot
        });
      } else {
        Logger.error('Unexpected error:', error);
      }
      throw error;
    }
  }

  async clickShowBenefits(): Promise<void> {
    try {
      Logger.step('Clicking Show Benefits button...');
      await this.waitForVisible(SupportCalculatorFormPageLocators.showBenefitsButton);
      await this.page.locator(SupportCalculatorFormPageLocators.showBenefitsButton).click();
      Logger.success('Show Benefits button clicked successfully');
    } catch (error: any) {
      await this.handleError(error, 'Show Benefits Button');
    }
  }
}



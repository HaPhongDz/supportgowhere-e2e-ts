// pages/SupportCalculatorFormPage.ts
import { Page } from '@playwright/test';
import SupportCalculatorFormPageLocators from '../locators/supportCalculatorFormPageLocators';
import { Logger } from '../utils/Logger';
import { ERROR_MESSAGES } from '../constants/errorMessages';

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



  async fillForm(data: { [key: string]: string }): Promise<void> {
    Logger.step('Starting form fill...');

    try {
      // Fill Year of Birth
      if (data['Year of birth']) {
        await this.page.locator(SupportCalculatorFormPageLocators.yearOfBirthDropdown).click();
        await this.page.locator(SupportCalculatorFormPageLocators.getDropdownOption(data['Year of birth'])).click();
      }
      
      // Fill Assessable Income
      if (data['Recent Assessable Income (AI)']) {
        await this.page.locator(SupportCalculatorFormPageLocators.assessableIncomeDropdown).click();
        await this.page.locator(SupportCalculatorFormPageLocators.getDropdownOption(data['Recent Assessable Income (AI)'])).click();
      }
      
      // Fill Housing Type
      if (data['Housing type']) {
        await this.page.locator(SupportCalculatorFormPageLocators.housingTypeDropdown).click();
        await this.page.locator(SupportCalculatorFormPageLocators.getDropdownOption(data['Housing type'])).click();
      }
      
      // Fill Property Ownership
      if (data['Property ownership']) {
        await this.page.locator(SupportCalculatorFormPageLocators.propertyOwnershipDropdown).click();
        await this.page.locator(SupportCalculatorFormPageLocators.getDropdownOption(data['Property ownership'])).click();
      }
      
      // Select Multiple Property
      if (data['Do you own more than 1 property?']) {
        const option = data['Do you own more than 1 property?'] === 'Yes' 
          ? SupportCalculatorFormPageLocators.ownsMoreThanOnePropertyYes
          : SupportCalculatorFormPageLocators.ownsMoreThanOnePropertyNo;
        await this.page.locator(option).click();
      }
      
      Logger.success('Form filled successfully');
    } catch (error) {
      Logger.error('Error filling form:', error);
      throw error;
    }
  }

  async clickShowBenefits(): Promise<void> {
    try {
      Logger.step('Clicking Show Benefits button...');
      await this.page.locator(SupportCalculatorFormPageLocators.showBenefitsButton).click();
      Logger.success('Show Benefits button clicked successfully');
    } catch (error) {
      Logger.error('Error clicking Show Benefits button:', error);
      throw error;
    }
  }

  async verifyRequiredFieldErrors(): Promise<{
    yearOfBirth: boolean,
    housingType: boolean,
    propertyOwnership: boolean,
    multipleProperty: boolean
  }> {
    try {
      Logger.step('Checking for required field error messages...');
      
      // Wait for all error messages to be visible
      await this.page.waitForTimeout(500); // Small timeout to ensure all errors are rendered
      
      // Check if error messages are present
      const yearOfBirthErrorVisible = await this.page.locator(SupportCalculatorFormPageLocators.yearOfBirthError).isVisible();
      const housingTypeErrorVisible = await this.page.locator(SupportCalculatorFormPageLocators.housingTypeError).isVisible();
      const propertyOwnershipErrorVisible = await this.page.locator(SupportCalculatorFormPageLocators.propertyOwnershipError).isVisible();
      const multiplePropertyErrorVisible = await this.page.locator(SupportCalculatorFormPageLocators.multiplePropertyError).isVisible();
      
      Logger.info('Error message visibility results:');
      Logger.info(`Year of Birth error visible: ${yearOfBirthErrorVisible}`);
      Logger.info(`Housing Type error visible: ${housingTypeErrorVisible}`);
      Logger.info(`Property Ownership error visible: ${propertyOwnershipErrorVisible}`);
      Logger.info(`Multiple Property error visible: ${multiplePropertyErrorVisible}`);
      
      return {
        yearOfBirth: yearOfBirthErrorVisible,
        housingType: housingTypeErrorVisible,
        propertyOwnership: propertyOwnershipErrorVisible,
        multipleProperty: multiplePropertyErrorVisible
      };
    } catch (error) {
      Logger.error('Error checking required field error messages:', error);
      throw error;
    }
  }
}



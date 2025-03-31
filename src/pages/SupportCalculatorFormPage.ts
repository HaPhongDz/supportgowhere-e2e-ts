// pages/SupportCalculatorFormPage.ts
import { Page } from 'playwright/test';
import supportCalculatorFormPageLocators from '../locators/supportCalculatorFormPageLocators';

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
  readonly page: Page;
  readonly birthYearInput: string;
  readonly incomeInput: string;
  readonly nsStatusRadio: string;
  readonly cpfInput: string;
  readonly propertyOwnershipDropdown: string;
  readonly housingTypeDropdown: string;
  readonly avDropdown: string;
  readonly showBenefitsButton: string;

  constructor(page: Page) {
    this.page = page;
    this.birthYearInput = supportCalculatorFormPageLocators.birthYearInput;
    this.incomeInput = supportCalculatorFormPageLocators.incomeInput;
    this.nsStatusRadio = supportCalculatorFormPageLocators.nsStatusRadio;
    this.cpfInput = supportCalculatorFormPageLocators.cpfInput;
    this.propertyOwnershipDropdown = supportCalculatorFormPageLocators.propertyOwnershipDropdown;
    this.housingTypeDropdown = supportCalculatorFormPageLocators.housingTypeDropdown;
    this.avDropdown = supportCalculatorFormPageLocators.avDropdown;
    this.showBenefitsButton = supportCalculatorFormPageLocators.showBenefitsButton;
  }

  async fillForm(data: FormData): Promise<void> {
    if (data.birthYear) await this.page.fill(this.birthYearInput, data.birthYear);
    if (data.income) await this.page.fill(this.incomeInput, data.income);
    if (data.nsStatus) await this.page.check(`${this.nsStatusRadio}[value="${data.nsStatus}"]`);
    if (data.cpf) await this.page.fill(this.cpfInput, data.cpf);
    if (data.propertyOwnership) await this.page.selectOption(this.propertyOwnershipDropdown, data.propertyOwnership);
    if (data.housingType) await this.page.selectOption(this.housingTypeDropdown, data.housingType);
    if (data.av) await this.page.selectOption(this.avDropdown, data.av);
  }

  async clickShowBenefits(): Promise<void> {
    await this.page.click(this.showBenefitsButton);
  }
}

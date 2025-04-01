// step-definitions/supportCalculator.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'playwright/test';
import { CustomWorld } from '../../hooks/hooks';
import HomePage from '../pages/HomePage';
import SupportCalculatorPage from '../pages/SupportCalculatorPage';
import SupportCalculatorFormPage from '../pages/SupportCalculatorFormPage';
import CalculatedResultPage from '../pages/CalculatedResultPage';
import { Logger } from '../utils/Logger';

let homePage: HomePage;
let supportCalculatorPage: SupportCalculatorPage;
let supportCalculatorFormPage: SupportCalculatorFormPage;
let calculatedResultPage: CalculatedResultPage;

Given('I navigate to {string}', async function (this: CustomWorld, url: string) {
  homePage = new HomePage(this.page!);
  await homePage.navigate(url);
});

When('I click on the calculator button on HomePage', async function (this: CustomWorld) {
  await homePage.clickCalculator();
});

When('I click on the start button on Support Calculator Page', async function (this: CustomWorld) {
  supportCalculatorPage = new SupportCalculatorPage(this.page!);
  await supportCalculatorPage.clickStart();
});

When('I fill in the form with the following data:', async function (this: CustomWorld, dataTable) {
  const supportCalculatorFormPage = new SupportCalculatorFormPage(this.page!);
  const data: { [key: string]: string } = {};
  dataTable.rows().forEach((row: string[]) => {
    data[row[0]] = row[1];
  });
  await supportCalculatorFormPage.fillForm(data);
});

When('I click on the {string} button', async function (this: CustomWorld, buttonText: string) {
  supportCalculatorFormPage = new SupportCalculatorFormPage(this.page!);
  await supportCalculatorFormPage.clickShowBenefits();
});

Then('I should see a result for {string} that includes {string}', async function (this: CustomWorld, packageName: string, expectedAmount: string) {
  Logger.step(`Checking ${packageName} with expected amount: ${expectedAmount}`);
  calculatedResultPage = new CalculatedResultPage(this.page!);

  // Extract year from package name and click on the corresponding tab
  if (packageName.includes('Assurance Package')) {
    const year = packageName.replace('Assurance Package ', '');
    await calculatedResultPage.clickYearTab(year);
  }
  
  // Check if the amount matches the expected value
  const amountText = await calculatedResultPage.getAmountForPackage(packageName);
  expect(amountText).not.toBeNull();
  expect(amountText).toContain(expectedAmount);
  
  Logger.success(`Successfully verified ${packageName} includes ${expectedAmount}`);
});

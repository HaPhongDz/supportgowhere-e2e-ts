// step-definitions/supportCalculator.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'playwright/test';
import { CustomWorld } from '../../hooks/hooks';
import HomePage from '../pages/HomePage';
import SupportCalculatorPage from '../pages/SupportCalculatorPage';
import SupportCalculatorFormPage from '../pages/SupportCalculatorFormPage';
import CalculatedResultPage from '../pages/CalculatedResultPage';

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

Then('I should see a result that includes {string}', async function (this: CustomWorld, expectedResult: string) {
  calculatedResultPage = new CalculatedResultPage(this.page!);
  const resultText = await calculatedResultPage.getResultText();
  await expect(resultText).toContain(expectedResult);
});

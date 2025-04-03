import { When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../hooks/world';
import SupportCalculatorFormPage from '../pages/SupportCalculatorFormPage';
import { FORM_LABELS } from '../constants/labels';
import { Logger } from '@src/utils/Logger';
import { expect } from '@playwright/test';

let supportCalculatorFormPage: SupportCalculatorFormPage;

When('I fill in the form with birth year {string}', async function (this: CustomWorld, birthYear: string) {
  supportCalculatorFormPage = new SupportCalculatorFormPage(this.page!);
  await supportCalculatorFormPage.fillForm({
    [FORM_LABELS.YEAR_OF_BIRTH]: birthYear
  });
});

Then('I should see the following fields with correct labels:', async function (this: CustomWorld, dataTable) {
  const rows = dataTable.hashes();
  
  for (const row of rows) {
    const field = row.field;
    const expectedVisibility = row.isVisible === 'true';
    await supportCalculatorFormPage.verifyFieldVisibilityAndLabel(field, expectedVisibility);
  }
}); 


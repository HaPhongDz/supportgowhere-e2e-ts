import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.locator('#react-select-4-placeholder').click();
  await page.getByRole('option', { name: '2-room flat' }).click();
  await page.getByRole('group', { name: 'Do you own more than 1' }).locator('div').nth(2).click();
});
// await page.locator('#react-select-5-placeholder').click();
// await page.getByRole('option', { name: 'Rented from HDB' }).click();
// await page.locator('div').filter({ hasText: /^Select$/ }).nth(2).click();
// await page.getByText('1980').click();
// await page.getByText('Select', { exact: true }).click();
// await page.getByRole('option', { name: 'Between $34,001 and $' }).click();
// await page.locator('.react-select__input-container').click();
// await page.getByText('1977').click();
// await page.locator('[id="property\\.typeOfPropertyOfResidence-container"] div').nth(3).click();await page.goto('https://supportgowhere.life.gov.sg/budget/support-calculator/form');
// await page.locator('.react-select__input-container').click();
// await page.getByText('1991').click();
// await page.locator('#react-select-4-placeholder').click();
// await page.getByRole('option', { name: '3-room flat' }).click();
// await page.locator('#react-select-5-placeholder').click();
// await page.getByRole('option', { name: 'Rented from HDB' }).click();
// await page.getByRole('group', { name: 'Do you own more than 1' }).locator('div').nth(4).click();
// await page.getByRole('button', { name: 'Show estimated benefits' }).click();
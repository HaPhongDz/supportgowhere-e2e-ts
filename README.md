# SupportGoWhere E2E Testing Framework

Automation testing framework for SupportGoWhere portal using Playwright, Cucumber (BDD) with HTML reporting and GitHub Actions CI/CD integration.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Page Object Model](#page-object-model)
- [CI/CD Integration](#cicd-integration)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Overview

This framework provides end-to-end testing for the SupportGoWhere portal, focusing on validating the support calculator functionality. It uses a Behavior-Driven Development (BDD) approach with Cucumber for test scenarios and Playwright for browser automation, all written in TypeScript.

## Features

- **BDD Testing**: Human-readable test scenarios using Gherkin syntax
- **Cross-Browser Testing**: Support for Chrome, Firefox, and WebKit
- **Parallel Execution**: Run tests in parallel for faster feedback
- **Custom Reporting**: HTML reports with screenshots for failed tests
- **CI/CD Integration**: GitHub Actions workflows for continuous testing
- **Page Object Model**: Structured, maintainable test architecture
- **Background Reuse**: Optimized test execution for scenarios with shared setup
- **Error Handling**: Robust error capture with screenshots

## Tech Stack

- **Playwright**: Modern browser automation library
- **Cucumber.js**: BDD testing framework
- **TypeScript**: Type-safe JavaScript
- **Node.js**: JavaScript runtime
- **GitHub Actions**: CI/CD platform
- **HTML Reporter**: Visual test reporting

## Project Structure

```
supportgowhere-e2e-ts/
├── .github/workflows/    # GitHub Actions CI/CD workflows
├── hooks/                # Cucumber hooks for test lifecycle
│   ├── hooks.ts          # Before/After hooks 
│   └── world.ts          # Custom world definition
├── reports/              # Test reports and screenshots
├── src/
│   ├── constants/        # Constants used throughout the tests
│   ├── features/         # Cucumber feature files (test scenarios)
│   ├── locators/         # Element selectors for pages
│   ├── pages/            # Page Object Models
│   ├── step-definitions/ # Step implementations for Cucumber scenarios
│   └── utils/            # Utility functions and helpers
├── cucumber.js           # Cucumber configuration
├── package.json          # Project dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-organization/supportgowhere-e2e-ts.git
   cd supportgowhere-e2e-ts
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Install browser drivers:
   ```
   npx playwright install
   ```

## Running Tests

### Basic Test Execution

Run all tests:
```
npm run test
```

Run tests and generate HTML report:
```
npm run test:report
```

### Browser-Specific Testing

Run tests in specific browsers:
```
npm run test:chrome
npm run test:firefox
npm run test:webkit
```

### Parallel Execution

Run tests in parallel (2 workers):
```
npm run test:parallel
```

## Test Structure

### Feature Files

Tests are written in Gherkin syntax within feature files:

```gherkin
Feature: Verify Support Calculator Quantum Payouts

  Background:
    Given I navigate to "https://supportgowhere.life.gov.sg"
    When I click on the calculator button on HomePage
    And I click on the start button on Support Calculator Page

  @positive
  Scenario Outline: Calculate quantum payout based on user inputs
    When I fill in the form with the following data:
      | field                           | value                                 |
      | Year of birth                   | <birthYear>                           |
      | Recent Assessable Income (AI)   | <income>                              |
      | Housing type                    | <housingType>                         |
      | Property ownership              | <propertyOwnership>                   |
      | Do you own more than 1 property?| <multipleProperty>                    |
    And I click Show estimated benefits
    Then I should see a result for "Assurance Package <year>" that includes "<expectedAmount>"

    Examples:
      | birthYear | income                | housingType | propertyOwnership         | multipleProperty | year | expectedAmount |
      | 1985      | Between $34,001 and $100,000 | 2-room flat | Rented from HDB     | No               | 2025 | $350           |
```

### Step Definitions

Step definitions implement the steps in feature files:

```typescript
When('I fill in the form with the following data:', async function (this: CustomWorld, dataTable) {
  supportCalculatorFormPage = new SupportCalculatorFormPage(this.page!);
  const data: { [key: string]: string } = {};
  
  // Process data table
  const rows = dataTable.hashes();
  if (rows && rows.length > 0) {
    rows.forEach((row: any) => {
      if (row.field && row.value) {
        data[row.field] = row.value;
      }
    });
  }
  
  await supportCalculatorFormPage.fillForm(data);
});
```

## Page Object Model

The framework uses the Page Object Model pattern to separate test logic from page interactions:

### Example Page Object

```typescript
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
      
      // Additional fields...
      
      Logger.success('Form filled successfully');
    } catch (error) {
      Logger.error('Error filling form:', error);
      throw error;
    }
  }
}
```

## CI/CD Integration

This framework integrates with GitHub Actions for continuous testing. Three workflows are available:

1. **CI Workflow**: Runs on pull requests and pushes to main branch
2. **Scheduled Tests**: Runs tests every 4 hours
3. **Manual Trigger**: Can be manually triggered from GitHub

### Workflow Features

- Installs dependencies and browser drivers
- Runs tests in headless mode
- Captures test results and reports
- Sends notification to Microsoft Teams on failures
- Uploads reports as artifacts

## Best Practices

### Feature Files

1. **Use Background for Common Steps**: Extract repeated setup steps into Background section
2. **Use Scenario Outlines**: For data-driven tests with Examples table
3. **Add Tags**: Use tags (@positive, @negative, @smoke, etc.) to categorize tests
4. **Keep Scenarios Focused**: Each scenario should test one specific behavior

### Step Definitions

1. **Keep Steps Atomic**: Each step should do one thing
2. **Proper Error Handling**: Log errors and take screenshots on failures
3. **Use Typed Data Tables**: Ensure correct typing for data tables
4. **Descriptive Step Names**: Steps should clearly describe what they do

### Page Objects

1. **Single Responsibility**: Each page object should represent one page
2. **Encapsulate Selectors**: Use locator files to store selectors
3. **Return Promises**: All methods should return promises for async operations
4. **Logging**: Log all actions for better debugging

### Error Handling

1. **Capture Screenshots**: Take screenshots on test failures
2. **Detailed Logging**: Log steps, actions, and errors
3. **Proper Try/Catch**: Handle exceptions gracefully
4. **Element Waiting**: Always wait for elements before interacting

## Troubleshooting

### Common Issues

**Issue**: Tests fail with element not found errors
**Solution**: Increase timeouts or use more robust selectors

**Issue**: Data tables not parsing correctly
**Solution**: Check the format of the data table in feature files

**Issue**: Background not detected
**Solution**: Ensure the Background section is correctly formatted in the feature file

**Issue**: Browser doesn't start
**Solution**: Check that browser drivers are installed with `npx playwright install`

### Debug Logging

Enable detailed logging for debugging:

```typescript
Logger.info('Detailed information for debugging');
```

Take screenshots at specific points:

```typescript
await this.page.screenshot({ path: 'debug.png', fullPage: true });
```

## License

This project is licensed under the MIT License - see the LICENSE file for details. 

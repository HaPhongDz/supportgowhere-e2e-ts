import { Before, BeforeAll, BeforeStep, After, AfterAll, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { Browser, chromium, Page, BrowserContext } from '@playwright/test';
import { CustomWorld } from './world';
import { Logger } from '../src/utils/Logger';
import path from 'path';
import fs from 'fs';

let browser: Browser;
let context: BrowserContext;
let page: Page;
let isBackgroundUsed = false; // Flag to check if Background is used in the feature

// Set default timeout to 60 seconds
setDefaultTimeout(60 * 1000);

BeforeAll(async function () {
  Logger.info('Starting browser...');
  browser = await chromium.launch({
    headless: false,
    args: ['--start-maximized']
  });
});

// Detect whether the feature has a Background
Before(async function (this: CustomWorld, scenario) {
  const featureName = scenario.gherkinDocument.feature?.name || "Unknown Feature";
  const hasBackground = !!scenario.gherkinDocument.feature?.children?.some(
    (child) => child.background
  );

  isBackgroundUsed = hasBackground;
  Logger.info(`🏗 Feature: "${featureName}" uses Background: ${isBackgroundUsed}`);

  if (!isBackgroundUsed) {
    Logger.info("Creating new browser context and page for each scenario...");
    if (this.context) await this.context.close();
    context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
      //recordVideo: {
      //  dir: 'reports/videos',
      //  size: { width: 1920, height: 1080 }
      //}
    });
  } else if (!context || !page) {
    Logger.info("Reusing browser context and page for all scenarios with Background...");
    context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
      //recordVideo: {
      //  dir: 'reports/videos',
      //  size: { width: 1920, height: 1080 }
      //}
    });
  }
  
  // Enable request interception
  // await context.route('**/*', async (route) => {
  //   const request = route.request();
  //   Logger.info(`Request: ${request.method()} ${request.url()}`);
  //   await route.continue();
  // });

  page = await context.newPage();
  this.page = page;
  this.context = context;
});

BeforeStep(async function (this: CustomWorld) {
  // Add any pre-step actions here
  Logger.info('Before step actions...');
});

After(async function (this: CustomWorld, scenario) {
  const status = scenario.result?.status;
  const scenarioName = scenario.pickle.name;
  
  Logger.info(`🌟 Scenario: "${scenarioName}" completed with status: ${status}`);

  if (status === Status.FAILED) {
    try {
      Logger.error(`Scenario "${scenarioName}" failed`);
      
      // Take screenshot with sanitized name
      const sanitizedScenarioName = scenarioName.replace(/[^a-zA-Z0-9]/g, "_");
      const screenshotPath = path.resolve(`./reports/screenshots/${sanitizedScenarioName}.png`);
      
      // Ensure the screenshots directory exists
      const screenshotDir = path.dirname(screenshotPath);
      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
      }
      
      // Take the screenshot
      const buffer = await this.page?.screenshot({ 
        path: screenshotPath,
        fullPage: true 
      });
      
      // Attach the screenshot to the JSON report
      if (this.attach && buffer) {
        this.attach(buffer, "image/png");
      }
      
      Logger.screenshot(screenshotPath, `Failed scenario: ${scenarioName}`);
    } catch (error) {
      Logger.error("Failed to capture or attach screenshot:", error);
    }
  } else {
    Logger.success(`Scenario "${scenarioName}" passed`);
  }
  
  // Only close context if not using background or this is the last scenario
  if (!isBackgroundUsed && this.context) {
    await this.context.close();
  }
});

AfterAll(async function () {
  Logger.info('Closing browser...');
  if (browser) {
    await browser.close();
  }
}); 
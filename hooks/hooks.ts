import { Before, After, setWorldConstructor, World } from '@cucumber/cucumber';
import { chromium, firefox, webkit, Browser, BrowserContext, Page, devices } from '@playwright/test';
import config from '../playwright.config';

// Define interface for Custom World
export interface CustomWorld extends World {
    browser?: Browser;
    context?: BrowserContext;
    page?: Page;
    browserName?: string;
}

// Set World Constructor with basic World implementation
setWorldConstructor(class extends World {
    constructor(options: any) {
        super(options);
    }
});

// Create new browser, context and page before each scenario
Before(async function (this: CustomWorld) {
    // Get browser name from environment variable or config
    const browserEnv = process.env.BROWSER;
    
    if (browserEnv) {
        // Use browser from environment variable
        this.browserName = browserEnv;
    } else {
        // Get browser configuration from the first project
        const projectConfig = config.projects?.[0]?.use || {};
        // Get browser name from config or default to chromium
        this.browserName = projectConfig.browserName || 'chromium';
    }
    
    // Launch the appropriate browser
    let browser;
    switch (this.browserName) {
        case 'firefox':
            browser = await firefox.launch({
                headless: config.use?.headless ?? false,
                slowMo: 1000
            });
            break;
        case 'webkit':
            browser = await webkit.launch({
                headless: config.use?.headless ?? false,
                slowMo: 1000
            });
            break;
        default:
            browser = await chromium.launch({
                headless: config.use?.headless ?? false,
                slowMo: 1000
            });
    }
    this.browser = browser;
    
    // Create context with options from config
    this.context = await this.browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    
    // Create page
    this.page = await this.context.newPage();
    
    // Maximize the window
    if (this.page) {
        await this.page.evaluate(() => {
            document.documentElement.requestFullscreen();
        });
    }
    
    // Log browser info
    console.log(`🌐 Running tests with ${this.browserName} browser in full screen mode`);
});

// Take screenshot on failure
After(async function (this: CustomWorld, scenario) {
    if (scenario.result?.status === 'FAILED' && this.page) {
        const screenshot = await this.page.screenshot({ 
            path: `test-results/screenshots/${scenario.pickle.name.replace(/\s+/g, '-')}-${Date.now()}.png`,
            fullPage: true 
        });
        await this.attach(screenshot, 'image/png');
    }
    
    // Close browser after each scenario
    if (this.browser) {
        await this.browser.close();
    }
}); 
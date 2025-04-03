import { Page, BrowserContext } from '@playwright/test';
import { World } from '@cucumber/cucumber';

export interface CustomWorld {
  page: Page;
  context: BrowserContext;
  attach?: (data: any, mediaType?: string) => Promise<void>;
} 
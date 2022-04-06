import { PlaywrightRequest } from './playwright.request';
import { Browser, BrowserContext, chromium, Page } from 'playwright';

// https://playwright.dev/docs/library

export type PlaywrightInstance = {
  browser: Browser;
  context: BrowserContext;
  page: Page;
};

export class PlaywrightAdapter {
  public async fetch(req: PlaywrightRequest): Promise<PlaywrightInstance> {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
      /* pass any options */
    });
    const page = await context.newPage();
    await page.goto(req.url.href);
    return {
      browser,
      context,
      page,
    };
  }
}

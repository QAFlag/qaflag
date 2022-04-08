import { PlaywrightRequest } from './playwright.request';
import { Browser, BrowserContext, chromium, Page } from 'playwright';

// https://playwright.dev/docs/library

export type PlaywrightInstance = {
  browser: Browser;
  context: BrowserContext;
  page: Page;
};

export class PlaywrightAdapter {
  public async fetch(request: PlaywrightRequest): Promise<PlaywrightInstance> {
    const persona = request.persona;
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
      /* pass any options */
      geolocation: persona?.geolocation,
      httpCredentials: persona?.basicAuthentication,
      locale: persona?.languageLocale,
      acceptDownloads: false,
      bypassCSP: false,
      ignoreHTTPSErrors: false,
    });
    context.addCookies(request.getCookiesArray());
    const page = await context.newPage();
    await page.goto(request.url.href);
    return {
      browser,
      context,
      page,
    };
  }
}

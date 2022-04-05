import { AdapterInterface } from '@qaflag/core';
import { PlaywrightRequest } from './playwright.request';
import { chromium } from 'playwright';

// https://playwright.dev/docs/library

export class PlaywrightAdapter implements AdapterInterface {
  public async fetch(req: PlaywrightRequest) {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
      /* pass any options */
    });
    const page = await context.newPage();
    await page.goto(req.url.href);
    await browser.close();
    return {
      duration: 0,
      headers: {},
      trailers: {},
      cookies: {},
      status: {
        code: 200,
        text: 'OK',
      },
      data: '',
    };
  }
}

import { PlaywrightRequest } from './playwright.request';
import {
  Browser,
  BrowserContext,
  BrowserType,
  chromium,
  firefox,
  Page,
  webkit,
} from 'playwright';
import { PersonaInterface } from '@qaflag/core';

// https://playwright.dev/docs/library

export type PlaywrightInstance = {
  browser: Browser;
  context: BrowserContext;
  page: Page;
};

export class PlaywrightAdapter {
  protected getBrowserEngine(persona?: PersonaInterface): BrowserType {
    if (persona?.browser?.product == 'firefox') return firefox;
    if (persona?.browser?.product == 'safari') return webkit;
    return chromium;
  }

  protected getProxy(request: PlaywrightRequest) {
    return request.proxy
      ? {
          server: `${request.proxy.protocol}://${request.proxy.host}:${request.proxy.port}`,
          username: request.proxy.auth.username,
          password: request.proxy.auth.password,
        }
      : undefined;
  }

  public async fetch(request: PlaywrightRequest): Promise<PlaywrightInstance> {
    const persona = request.persona;
    const browserEngine = this.getBrowserEngine(persona);
    const browser = await browserEngine.launch({
      headless: false,
      channel: persona?.browser?.product,
      args: undefined,
      chromiumSandbox: undefined,
      devtools: undefined,
      downloadsPath: undefined,
      executablePath: persona?.browser?.executablePath,
      firefoxUserPrefs: persona?.browser?.userPreferences,
      proxy: this.getProxy(request),
      timeout: 30000,
      slowMo: undefined,
    });
    const context = await browser.newContext({
      geolocation: persona?.geolocation,
      httpCredentials: persona?.basicAuthentication,
      locale: persona?.language,
      acceptDownloads: false,
      bypassCSP: false,
      ignoreHTTPSErrors: false,
      colorScheme: persona?.colorScheme,
      deviceScaleFactor: persona?.browser?.deviceScaleFactor,
      forcedColors: undefined,
      hasTouch: persona?.deviceInputs.includes('touch'),
      isMobile: persona?.deviceType == 'phone',
      javaScriptEnabled: persona?.browser?.javaScriptEnabled,
      offline: persona?.connectionType == 'offline',
      permissions: persona?.browser?.permissions,
      proxy: this.getProxy(request),
      recordVideo: undefined,
      reducedMotion: persona?.disabilities.includes('motion-disorder')
        ? 'reduce'
        : 'no-preference',
      screen: persona?.screenSize,
      storageState: {
        cookies: [],
        origins: [],
      },
      timezoneId: persona?.timezone,
      //userAgent: request.userAgent, // this line was causing problems
      viewport: persona?.viewportSize,
    });
    context.addCookies(request.getCookies());
    const page = await context.newPage();
    await page.goto(request.url.href);
    return {
      browser,
      context,
      page,
    };
  }
}

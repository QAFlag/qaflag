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
import { Persona } from '@qaflag/core';

// https://playwright.dev/docs/library

export type PlaywrightInstance = {
  browser: Browser;
  context: BrowserContext;
  page: Page;
};

export class PlaywrightAdapter {
  protected getBrowserEngine(persona?: Persona): BrowserType {
    if (persona?.browser?.engine == 'firefox') return firefox;
    if (persona?.browser?.engine == 'webkit') return webkit;
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
      channel: persona?.browser?.channel,
      args: persona?.browser?.args,
      chromiumSandbox: persona?.browser?.chromiumSandbox,
      devtools: persona?.browser?.devtools,
      downloadsPath: undefined,
      executablePath: persona?.browser?.executablePath,
      firefoxUserPrefs: persona?.browser?.userPrefs,
      proxy: this.getProxy(request),
      timeout: 30000,
      slowMo: undefined,
    });
    const context = await browser.newContext({
      geolocation: persona?.geolocation,
      httpCredentials: persona?.basicAuthentication,
      locale: persona?.languageLocale,
      acceptDownloads: false,
      bypassCSP: false,
      ignoreHTTPSErrors: false,
      colorScheme: persona?.browser?.colorScheme,
      deviceScaleFactor: persona?.browser?.deviceScaleFactor,
      forcedColors: persona?.browser?.forcedColors,
      hasTouch: persona?.deviceInputs.includes('touch'),
      isMobile: persona?.isMobile,
      javaScriptEnabled: persona?.browser?.javaScriptEnabled,
      offline: persona?.isOffline,
      permissions: persona?.browser?.permissions,
      proxy: this.getProxy(request),
      recordVideo: undefined,
      reducedMotion: persona?.browser?.reducedMotion,
      screen: persona?.screenSize,
      storageState: {
        cookies: [],
        origins: persona?.browser?.storage || [],
      },
      timezoneId: persona?.timezone,
      //userAgent: request.userAgent, // this line was causing problems
      viewport: persona?.viewport,
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

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
      screen: persona.screenSize
        ? { width: persona.screenSize[0], height: persona.screenSize[1] }
        : undefined,
      storageState: {
        cookies: [],
        origins: [],
      },
      timezoneId: persona?.timezone,
      //userAgent: request.userAgent, // this line was causing problems
      viewport: persona.viewportSize
        ? { width: persona.viewportSize[0], height: persona.viewportSize[1] }
        : undefined,
    });
    await context.addCookies(request.getCookies());
    context.setDefaultTimeout(request.timeout || 10000);
    const page = await context.newPage();
    page.on('domcontentloaded', () => {
      page.addScriptTag({
        content: `
            const div = document.createElement("div");
            div.setAttribute("id", "_QAFLAG_HELPER_");
            document.querySelector("body").appendChild(div);
            div.innerHTML = "<div class='qaFlagTop' style='position: fixed; top: -1px; width: 100%; height: 1px'></div>";
            div.innerHTML += "<div class='qaFlagBottom' style='position: fixed; bottom: -1px; left: 0px; width: 100%; height: 1px'></div>";
            div.innerHTML += "<div class='qaFlagLeft' style='position: fixed; top: 0px; left: -1px; width: 1px; height: 100%'></div>";
            div.innerHTML += "<div class='qaFlagRight' style='position: fixed; top: 0px; right: -1px; width: 1px; height: 100%'></div>";
            div.innerHTML += "<div class='qaFlagTL' style='position: fixed; top: -1px; left: -1px; width: 1px; height: 1px'></div>";
            div.innerHTML += "<div class='qaFlagTR' style='position: fixed; top: -1px; right: -1px; width: 1px; height: 1px'></div>";
            div.innerHTML += "<div class='qaFlagBL' style='position: fixed; bottom: -1px; left: -1px; width: 1px; height: 1px'></div>";
            div.innerHTML += "<div class='qaFlagBR' style='position: fixed; bottom: -1px; right: -1px; width: 1px; height: 1px'></div>";
        `,
      });
    });
    await page.goto(request.url.href);
    return {
      browser,
      context,
      page,
    };
  }
}

import {
  Context,
  ContextInterface,
  ScenarioInterface,
  StringValue,
} from '@qaflag/core';
import { Locator, PageScreenshotOptions } from 'playwright';
import { PlaywrightInstance } from './playwright.adapter';
import { PlaywrightValue } from './playwright.value';

export type NavigationOpts =
  | {
      timeout?: number | undefined;
      waitUntil?:
        | 'load'
        | 'domcontentloaded'
        | 'networkidle'
        | 'commit'
        | undefined;
    }
  | undefined;

export type FindOpts = {
  has?: Locator;
  hasText?: string | RegExp;
};

export class PlaywrightContext extends Context implements ContextInterface {
  constructor(
    public readonly scenario: ScenarioInterface,
    protected readonly playwright: PlaywrightInstance,
  ) {
    super(scenario);
  }

  public get url() {
    return new StringValue(this.page.url(), {
      name: 'URL',
      logger: this,
    });
  }

  public get page() {
    return this.playwright.page;
  }

  public get browser() {
    return this.playwright.browser;
  }

  public get browserContext() {
    return this.playwright.context;
  }

  public find(selector: string, opts?: FindOpts) {
    return new PlaywrightValue(this.playwright.page.locator(selector, opts), {
      name: selector,
      logger: this.scenario,
    });
  }

  public async exists(selector: string, opts?: FindOpts) {
    const locator = this.find(selector, opts);
    await locator.must.exist();
    return locator;
  }

  public async screenshot(opts: PageScreenshotOptions) {
    return this.page.screenshot(opts);
  }

  public async reload(opts: NavigationOpts) {
    return this.page.reload(opts);
  }

  public async goForward(opts: NavigationOpts) {
    return this.page.goForward(opts);
  }

  public async goBack(opts: NavigationOpts) {
    return this.page.goBack(opts);
  }

  public async goTo(url: string, opts: NavigationOpts) {
    return this.page.goto(url, opts);
  }
}
